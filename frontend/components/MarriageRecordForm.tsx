"use client"

import React, {useCallback, useEffect, useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Calendar, Image, Link, MapPin, PaperclipIcon, Trash2} from "lucide-react"
import {
    FamilyStatus,
    FuzzyDate,
    Landowner,
    MarriageRecord,
    Place,
    SocialStatus,
    Uyezd,
    Volost,
} from "@/app/types/models"
import {autocompleteApi} from "@/app/api/api"

interface RecordFormProps {
    record: MarriageRecord
    index: number
    onRecordChange: (id: number, field: string, value: any, key?: keyof FuzzyDate) => void
    onRemoveRecord: (id: number) => void
}

export function MarriageRecordForm({
                                       record,
                                       index,
                                       onRecordChange,
                                       onRemoveRecord,
                                   }: RecordFormProps) {
    const [showImageInput, setShowImageInput] = useState(false)
    const [imageInputType, setImageInputType] = useState<"file" | "url">("url")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState({
        names: {firstName: [], lastName: [], middleName: [], landowners: []},
    })
    const [uyezdy, setUyezdy] = useState<Uyezd[]>([])

    const [groomVolosts, setGroomVolosts] = useState<Volost[]>([])
    const [brideVolosts, setBrideVolosts] = useState<Volost[]>([])
    const [guarantorVolosts, setGuarantorVolosts] = useState<Volost[]>([])

    const [groomPlaces, setGroomPlaces] = useState<Place[]>([])
    const [bridePlaces, setBridePlaces] = useState<Place[]>([])
    const [guarantorPlaces, setGuarantorPlaces] = useState<Place[]>([])

    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([])
    const [socialStatuses, setSocialStatuses] = useState<SocialStatus[]>([])

    // Загрузка данных для автодополнения
    const fetchUyezdy = async () => {
        try {
            const response = await autocompleteApi.getUyezdy()
            setUyezdy(response.data || [])
        } catch (error) {
            console.error("Ошибка загрузки уездов:", error)
        }
    }
    const fetchVolosts = async (uyezdId: number, field: keyof MarriageRecord) => {
        try {
            const response = await autocompleteApi.getVolosts(uyezdId)
            switch (field) {
                case "groomVolost":
                    setGroomVolosts(response.data || [])
                case "brideVolost":
                    setBrideVolosts(response.data || [])
                case "guarantorVolost":
                    setGuarantorVolosts(response.data || [])
            }
        } catch (error) {
            console.error("Ошибка загрузки волостей:", error)
        }
    }
    const fetchPlaces = async (volostId: number, field: keyof MarriageRecord) => {
        try {
            const response = await autocompleteApi.getPlaces(volostId)
            switch (field) {
                case "groomPlace":
                    setGroomPlaces(response.data || [])
                case "bridePlace":
                    setBridePlaces(response.data || [])
                case "guarantorPlace":
                    setGuarantorPlaces(response.data || [])
            }
        } catch (error) {
            console.error("Ошибка загрузки мест:", error)
        }
    }
    const fetchFamilyStatuses = async () => {
        try {
            const response = await autocompleteApi.getFamilyStatuses()
            setFamilyStatuses(response.data || [])
        } catch (error) {
            console.error("Ошибка загрузки семейных статусов:", error)
        }
    }
    const fetchSocialStatuses = async () => {
        try {
            const response = await autocompleteApi.getSocialStatuses()
            setSocialStatuses(response.data || [])
        } catch (error) {
            console.error("Ошибка загрузки социальных статусов:", error)
        }
    }

    useEffect(() => {
        fetchUyezdy()
        fetchFamilyStatuses()
        fetchSocialStatuses()
    }, [])

    // Обработка загрузки изображения
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                onRecordChange(record.idDate!, "image", base64String)
                setImagePreview(base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleInputChange = useCallback(async (field: keyof MarriageRecord, value: string) => {
        if (field === "groomLandowner" || field === "brideLandowner") {
            onRecordChange(record.idDate!, field, {landowner: value, id: undefined, place: null})
        } else {
            onRecordChange(record.idDate!, field, value)
        }

        if (value.length > 1) {
            try {
                let response
                switch (field) {
                    case "groomFirstName":
                    case "brideFirstName":
                    case "groomFatherFirstName":
                    case "brideFatherFirstName":
                    case "guarantorFirstName":
                        response = await autocompleteApi.getFirstNames(value)
                        break
                    case "groomLastName":
                    case "brideLastName":
                    case "groomFatherLastName":
                    case "brideFatherLastName":
                    case "guarantorLastName":
                        response = await autocompleteApi.getLastNames(value)
                        break
                    case "groomMiddleName":
                    case "groomFatherMiddleName":
                    case "brideMiddleName":
                    case "brideFatherMiddleName":
                    case "guarantorMiddleName":
                        response = await autocompleteApi.getMiddleNames(value)
                        break
                    case "groomLandowner":
                    case "brideLandowner":
                        response = await autocompleteApi.getLandowners(value)
                        break
                }
                setSuggestions((prev) => ({...prev, [field]: response?.data || []}));
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error)
            }
        } else {
            setSuggestions((prev) => ({...prev, names: {...prev.names, [field]: []}}))
        }
    }, [record.idDate, onRecordChange])
    const renderSuggestionInput = (field: string, label: string, label2: string) => {
        const value = record[field] as string;

        return (
            <div className="relative space-y-2">
                <Label htmlFor={`${field}-${record.idDate}`} className="text-base">
                    {label}
                </Label>
                <Input
                    placeholder={`Введите ${label2}`}
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full"
                />

                {suggestions[field]?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(suggestions[field] as string[]).map((suggestion, index) => {

                            return (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        onRecordChange(record.idDate!, field, suggestion)
                                        setSuggestions({
                                            names: {firstName: [], lastName: [], middleName: [], landowners: []},
                                        });
                                    }}
                                >
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        )
    }
    const renderLandownerInput = (field: keyof MarriageRecord, label: string, label2: string) => {
        const value = (record[field] as Landowner | null)?.landowner || "";

        return (
            <div className="relative space-y-2">
                <Label htmlFor={`${field}-${record.idDate}`} className="text-base">
                    {label}
                </Label>
                <Input
                    placeholder={`Введите ${label2}`}
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full"
                />

                {suggestions[field]?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(suggestions[field] as Landowner[]).map((suggestion, index) => {
                            const displayText = `${suggestion.landowner} (${suggestion.place?.place || "—"})`;

                            return (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        onRecordChange(record.idDate!, field, suggestion);
                                        setSuggestions({
                                            names: {firstName: [], lastName: [], middleName: [], landowners: []},
                                        });
                                    }}
                                >
                                    {displayText}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    };

    const renderDateInput = (field: "marriageDate", label: string) => {
        const date = record[field]

        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4"/>
                    {label}
                </Label>
                <Select
                    value={date?.description || ""}
                    onValueChange={(value) => onRecordChange(record.idDate!, field, {...date, description: value})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите тип даты"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Точная дата">Точная дата</SelectItem>
                        <SelectItem value="Диапазон">Диапазон</SelectItem>
                        <SelectItem value="До">До</SelectItem>
                        <SelectItem value="После">После</SelectItem>
                        <SelectItem value="Около">Около</SelectItem>
                    </SelectContent>
                </Select>

                {["До", "После", "Около", "Точная дата"].includes(date?.description || "") && (
                    <Input
                        type="date"
                        value={date?.exactDate || ""}
                        onChange={(e) => onRecordChange(record.idDate!, field, {...date, exactDate: e.target.value})}
                        className="mt-2"
                    />
                )}

                {date?.description === "Диапазон" && (
                    <div className="mt-2 flex gap-2">
                        <Input
                            type="date"
                            placeholder="Начальная дата"
                            value={date.startDate || ""}
                            onChange={(e) => onRecordChange(record.idDate!, field, {...date, startDate: e.target.value})}
                        />
                        <Input
                            type="date"
                            placeholder="Конечная дата"
                            value={date.endDate || ""}
                            onChange={(e) => onRecordChange(record.idDate!, field, {...date, endDate: e.target.value})}
                        />
                    </div>
                )}
            </div>
        )
    }

    const renderStatusInput = (field: keyof MarriageRecord) => {
        const isFamily = field.toLowerCase().includes("family");
        const statuses = isFamily ? familyStatuses : socialStatuses;

        return (
            <div className="space-y-2">
                <Label className="text-base">
                    {isFamily ? "Семейный статус" : "Социальный статус"}
                </Label>
                <Select
                    value={record[field]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedStatus = statuses.find((status) => status.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, field, selectedStatus);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={isFamily ? "Выберите семейный статус" : "Выберите социальный статус"}/>
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.length > 0 ? (
                            statuses.map((status) => (
                                <SelectItem key={status.id} value={status.id?.toString() || ""}>
                                    {isFamily ? status.familyStatus : status.socialStatus}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem key="loading" value="loading" disabled>
                                {isFamily ? "Семейные статусы не найдены" : "Социальные статусы не найдены"}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    const renderLocationSelectors = (fieldPrefix: string = "") => {
        const getFieldName = (baseField: string) => (fieldPrefix ? `${fieldPrefix}${baseField}` : baseField);

        const volostLists = {
            groom: groomVolosts,
            bride: brideVolosts,
            guarantor: guarantorVolosts,
        };
        const getVolostList = (fieldPrefix: string) => volostLists[fieldPrefix] || [];

        const placeLists = {
            groom: groomPlaces,
            bride: bridePlaces,
            guarantor: guarantorPlaces,
        };
        const getPlaceList = (fieldPrefix: string) => placeLists[fieldPrefix] || [];


        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4"/>
                    {"Место рождения"}
                </Label>

                {/* Уезд */}
                <Select
                    value={record[getFieldName("Uyezd")]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedUyezd = uyezdy.find((u) => u.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Uyezd"), selectedUyezd);
                        onRecordChange(record.idDate!, getFieldName("Volost"), null);
                        onRecordChange(record.idDate!, getFieldName("Place"), null);
                        fetchVolosts(selectedUyezd?.id, getFieldName("Volost"));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите уезд"/>
                    </SelectTrigger>
                    <SelectContent>
                        {uyezdy.length > 0 ? (
                            uyezdy.map((uyezd) => (
                                <SelectItem key={uyezd.id} value={uyezd.id?.toString() || ""}>
                                    {uyezd.uyezd}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem key="loading" value="loading" disabled>
                                Уезды не найдены
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>

                {/* Волость */}
                <Select
                    value={record[getFieldName("Volost")]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedVolost = getVolostList(fieldPrefix).find((v) => v.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Volost"), selectedVolost);
                        onRecordChange(record.idDate!, getFieldName("Place"), null);
                        fetchPlaces(selectedVolost?.id, getFieldName("Place"));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите волость"/>
                    </SelectTrigger>
                    <SelectContent>
                        {record[getFieldName("Uyezd")] ? (
                            getVolostList(fieldPrefix).map((volost) => (
                                <SelectItem key={volost.id} value={volost.id?.toString() || ""}>
                                    {volost.volost}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem key="loading" value="loading" disabled>
                                Волости не найдены
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>

                {/* Место */}
                <Select
                    value={record[getFieldName("Place")]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedPlace = getPlaceList(fieldPrefix).find((p) => p.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Place"), selectedPlace);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите место"/>
                    </SelectTrigger>
                    <SelectContent>
                        {record[getFieldName("Volost")] ? (
                            getPlaceList(fieldPrefix).map((place) => (
                                <SelectItem key={place.id} value={place.id?.toString() || ""}>
                                    {place.place}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem key="loading" value="loading" disabled>
                                Места не найдены
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    return (
        <div className="p-4 border rounded-lg space-y-4 mb-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg flex items-center gap-2">
                    <span
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
                        {index + 1}
                    </span>
                    <span>Запись</span>
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRecord(record.idDate!)}
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 md:col-span-2">
                    {renderDateInput("marriageDate", "Дата венчания")}
                </div>

                {/* Информация о женихе */}
                <div className="space-y-4 border-t pt-4 md:col-span-1">
                    <h4 className="font-medium text-base">Информация о женихе</h4>

                    {renderSuggestionInput("groomLastName", "Фамилия жениха", "фамилию")}
                    {renderSuggestionInput("groomFirstName", "Имя жениха", "имя")}
                    {renderSuggestionInput("groomMiddleName", "Отчество жениха", "отчество")}

                    <div className="space-y-2">
                        <Label htmlFor={`groomAge-${record.idDate}`}>Возраст жениха</Label>
                        <Input
                            id={`groomAge-${record.idDate}`}
                            type="number"
                            min="0"
                            value={record.groomAge || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "groomAge", Number(e.target.value))}
                        />
                    </div>

                    {renderLocationSelectors("groom")}

                    {renderLandownerInput("groomLandowner", "Землевладелец жениха", "имя землевладельца")}
                    {renderStatusInput("groomSocialStatus")}

                    <div className="space-y-2">
                        <Label htmlFor={`groomMarriageNumber-${record.idDate}`}>Номер брака жениха</Label>
                        <Input
                            id={`groomMarriageNumber-${record.idDate}`}
                            type="number"
                            min="0"
                            value={record.groomMarriageNumber || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "groomMarriageNumber", Number(e.target.value))}
                        />
                    </div>

                    {/* Информация об отце жениха */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-base">Информация об отце жениха</h4>
                        {renderSuggestionInput("groomFatherLastName", "Фамилия отца жениха", "фамилию")}
                        {renderSuggestionInput("groomFatherFirstName", "Имя отца жениха", "имя")}
                        {renderSuggestionInput("groomFatherMiddleName", "Отчество отца жениха", "отчество")}
                        {renderStatusInput("groomFatherSocialStatus")}
                    </div>
                </div>

                {/* Информация о невесте */}
                <div className="space-y-4 border-t pt-4 md:col-span-1">
                    <h4 className="font-medium text-base">Информация о невесте</h4>

                    {renderSuggestionInput("brideLastName", "Фамилия невесты", "фамилию")}
                    {renderSuggestionInput("brideFirstName", "Имя невесты", "имя")}
                    {renderSuggestionInput("brideMiddleName", "Отчество невесты", "отчество")}

                    <div className="space-y-2">
                        <Label htmlFor={`brideAge-${record.idDate}`}>Возраст невесты</Label>
                        <Input
                            id={`brideAge-${record.idDate}`}
                            type="number"
                            min="0"
                            value={record.brideAge || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "brideAge", Number(e.target.value))}
                        />
                    </div>

                    {renderLocationSelectors("bride")}

                    {renderLandownerInput("brideLandowner", "Землевладелец невесты", "имя землевладельца")}
                    {renderStatusInput("brideSocialStatus")}

                    <div className="space-y-2">
                        <Label htmlFor={`brideMarriageNumber-${record.idDate}`}>Номер брака невесты</Label>
                        <Input
                            id={`brideMarriageNumber-${record.idDate}`}
                            type="number"
                            min="0"
                            value={record.brideMarriageNumber || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "brideMarriageNumber", Number(e.target.value))}
                        />
                    </div>

                    {/* Информация об отце невесты */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-base">Информация об отце невесты</h4>
                        {renderSuggestionInput("brideFatherLastName", "Фамилия отца невесты", "фамилию")}
                        {renderSuggestionInput("brideFatherFirstName", "Имя отца невесты", "имя")}
                        {renderSuggestionInput("brideFatherMiddleName", "Отчество отца невесты", "отчество")}
                        {renderStatusInput("brideFatherSocialStatus")}
                    </div>
                </div>

                {/* Информация о поручителе */}
                <div className="space-y-4 border-t pt-4 md:col-span-2">
                    <h4 className="font-medium text-base">Информация о поручителе</h4>

                    {renderSuggestionInput("guarantorLastName", "Фамилия поручителя", "фамилию")}
                    {renderSuggestionInput("guarantorFirstName", "Имя поручителя", "имя")}
                    {renderSuggestionInput("guarantorMiddleName", "Отчество поручителя", "отчество")}

                    {renderLocationSelectors("guarantor")}

                    <div className="space-y-2">
                        <Label htmlFor={`guarantorRole-${record.idDate}`}>Роль поручителя</Label>
                        <Input
                            id={`guarantorRole-${record.idDate}`}
                            value={record.guarantorRole || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "guarantorRole", e.target.value)}
                        />
                    </div>

                    {renderStatusInput("guarantorFamilyStatus")}
                    {renderStatusInput("guarantorSocialStatus")}
                </div>
            </div>

            {/* Поля для изображения */}
            {!showImageInput && (
                <Button type="button" variant="outline" onClick={() => setShowImageInput(true)} className="w-full">
                    <PaperclipIcon className="mr-2 h-4 w-4"/>
                    Прикрепить изображение
                </Button>
            )}

            {showImageInput && (
                <div className="space-y-2">
                    <Label className="text-base">Прикрепленное изображение</Label>
                    <Textarea
                        placeholder="Описание изображения"
                        value={record.imageDescription || ""}
                        onChange={(e) => onRecordChange(record.idDate!, "imageDescription", e.target.value)}
                        className="h-20 text-base"
                    />
                    <div className="flex space-x-2">
                        <Button
                            type="button"
                            variant={imageInputType === "file" ? "default" : "outline"}
                            onClick={() => setImageInputType("file")}
                        >
                            <Image className="h-4 w-4 mr-2"/>
                            Файл
                        </Button>
                        <Button
                            type="button"
                            variant={imageInputType === "url" ? "default" : "outline"}
                            onClick={() => setImageInputType("url")}
                        >
                            <Link className="h-4 w-4 mr-2"/>
                            URL
                        </Button>
                    </div>
                    {imageInputType === "file" ? (
                        <Input type="file" accept="image/*" onChange={handleImageUpload}
                               className="h-10 text-base"/>
                    ) : (
                        <Input
                            type="url"
                            placeholder="Введите URL изображения"
                            value={record.image || ""}
                            onChange={(e) => onRecordChange(record.idDate!, "image", e.target.value)}
                            className="h-10 text-base"
                        />
                    )}
                    {(imagePreview || record.image) && (
                        <div className="mt-2">
                            <img
                                src={imagePreview || record.image || "/placeholder.svg"}
                                alt="Preview"
                                className="max-w-full h-auto max-h-40 object-contain"
                            />
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}
