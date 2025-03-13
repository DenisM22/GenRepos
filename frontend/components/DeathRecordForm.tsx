"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Image, Link, MapPin, PaperclipIcon, Trash2 } from "lucide-react"
import {
    BirthRecord, DeathRecord,
    FamilyStatus,
    FuzzyDate,
    Landowner, PersonFromConfessionalDocument,
    Place,
    SocialStatus,
    Uyezd,
    Volost,
} from "@/app/types/models"
import { autocompleteApi } from "@/app/api/api"
import {Checkbox} from "@/components/ui/checkbox";

interface RecordFormProps {
    record: DeathRecord
    index: number
    onRecordChange: (id: number, field: string, value: any, key?: keyof FuzzyDate) => void
    onRemoveRecord: (id: number) => void
}

export function DeathRecordForm({
                                     record,
                                     index,
                                     onRecordChange,
                                     onRemoveRecord,
                                 }: RecordFormProps) {
    const [showImageInput, setShowImageInput] = useState(false)
    const [imageInputType, setImageInputType] = useState<"file" | "url">("url")
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [suggestions, setSuggestions] = useState({
        names: { firstName: [], lastName: [], middleName: [], landowners: [] },
    })

    const [uyezdy, setUyezdy] = useState<Uyezd[]>([])
    const [volosts, setVolosts] = useState<Volost[]>([])
    const [places, setPlaces] = useState<Place[]>([])

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
    const fetchVolosts = async (uyezdId: number) => {
        try {
            const response = await autocompleteApi.getVolosts(uyezdId)
            setVolosts(response.data || [])
        } catch (error) {
            console.error("Ошибка загрузки волостей:", error)
        }
    }
    const fetchPlaces = async (volostId: number) => {
        try {
            const response = await autocompleteApi.getPlaces(volostId)
            setPlaces(response.data || [])
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

    const handleInputChange = useCallback(async (field: keyof DeathRecord, value: string) => {

        onRecordChange(record.idDate!, field, value)

        if (value.length > 1) {
            try {
                let response
                switch (field) {
                    case "firstName":
                        response = await autocompleteApi.getFirstNames(value)
                        break
                    case "lastName":
                        response = await autocompleteApi.getLastNames(value)
                        break
                    case "middleName":
                        response = await autocompleteApi.getMiddleNames(value)
                        break
                }
                setSuggestions((prev) => ({ ...prev, [field]: response?.data || [] }));
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error)
            }
        } else {
            setSuggestions((prev) => ({ ...prev, names: { ...prev.names, [field]: [] } }))
        }
    }, [])
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

    const renderGenderInput = () => {
        return (
            <div className="space-y-2">
                <Label className="text-base">Пол</Label>
                <Select value={record.gender || "MALE"} onValueChange={handleGenderChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите пол"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">Мужской</SelectItem>
                        <SelectItem value="FEMALE">Женский</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    };
    const handleGenderChange = (value: "MALE" | "FEMALE") => {
        onRecordChange(record.idDate!, "gender", value)
    }

    const renderDateInput = (field: "deathDate", label: string) => {
        const date = record[field]

        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {label}
                </Label>
                <Select
                    value={date?.description || ""}
                    onValueChange={(value) => onRecordChange(record.idDate!, field, { ...date, description: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите тип даты" />
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
                        onChange={(e) => onRecordChange(record.idDate!, field, { ...date, exactDate: e.target.value })}
                        className="mt-2"
                    />
                )}

                {date?.description === "Диапазон" && (
                    <div className="mt-2 flex gap-2">
                        <Input
                            type="date"
                            placeholder="Начальная дата"
                            value={date.startDate || ""}
                            onChange={(e) => onRecordChange(record.idDate!, field, { ...date, startDate: e.target.value })}
                        />
                        <Input
                            type="date"
                            placeholder="Конечная дата"
                            value={date.endDate || ""}
                            onChange={(e) => onRecordChange(record.idDate!, field, { ...date, endDate: e.target.value })}
                        />
                    </div>
                )}
            </div>
        )
    }

    const renderLocationSelectors = (fieldPrefix: string = "") => {
        const getFieldName = (baseField: string) => (fieldPrefix ? `${fieldPrefix}${baseField}` : baseField);

        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4"/>
                    {fieldPrefix ? `Место погребения` : "Место рождения"}
                </Label>

                {/* Уезд */}
                <Select
                    value={record[getFieldName("Uyezd")]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedUyezd = uyezdy.find((u) => u.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Uyezd"), selectedUyezd);
                        onRecordChange(record.idDate!, getFieldName("Volost"), null);
                        onRecordChange(record.idDate!, getFieldName("Place"), null);
                        fetchVolosts(selectedUyezd?.id);
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
                        const selectedVolost = volosts.find((v) => v.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Volost"), selectedVolost);
                        onRecordChange(record.idDate!, getFieldName("Place"), null);
                        fetchPlaces(selectedVolost?.id);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите волость"/>
                    </SelectTrigger>
                    <SelectContent>
                        {record[getFieldName("Uyezd")] && volosts.length > 0 ? (
                            volosts.map((volost) => (
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
                        const selectedPlace = places.find((p) => p.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, getFieldName("Place"), selectedPlace);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите место"/>
                    </SelectTrigger>
                    <SelectContent>
                        {record[getFieldName("Volost")] && places.length > 0 ? (
                            places.map((place) => (
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

    const renderStatusInput = (field: keyof DeathRecord) => {
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
                        <SelectValue placeholder={isFamily ? "Выберите семейный статус" : "Выберите социальный статус"} />
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

    return (
        <div className="p-4 border rounded-lg space-y-3 mb-4">
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

            {renderSuggestionInput("lastName", "Фамилия", "фамилию")}
            {renderSuggestionInput("firstName", "Имя", "имя")}
            {renderSuggestionInput("middleName", "Отчество", "отчество")}
            {renderGenderInput()}
            {renderLocationSelectors()}

            {renderStatusInput("familyStatus")}
            {renderStatusInput("socialStatus")}

            {renderDateInput("deathDate", "Дата смерти")}

            <div className="space-y-2">
                <Label htmlFor={`deathCause-${record.idDate}`} className="text-base">
                    Причина смерти
                </Label>
                <Input
                    id={`deathCause-${record.idDate}`}
                    placeholder="Введите причину смерти"
                    value={record.deathCause || ""}
                    onChange={(e) => onRecordChange(record.idDate!, "deathCause", e.target.value)}
                />
            </div>

            {renderLocationSelectors("burial")}

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
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="h-10 text-base"/>
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