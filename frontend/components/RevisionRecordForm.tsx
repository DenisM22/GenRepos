"use client"

import React, {useCallback, useEffect, useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Image, Link, PaperclipIcon, Trash2} from "lucide-react"
import {FamilyStatus, FuzzyDate, Landowner, PersonFromRevisionDocument, SocialStatus} from "@/app/types/models"
import {autocompleteApi} from "@/app/api/api";

interface RecordFormProps {
    record: PersonFromRevisionDocument
    index: number
    onRecordChange: (id: number, field: string, value: any, key?: keyof FuzzyDate) => void
    onRemoveRecord: (id: number) => void
}

export function RevisionRecordForm({
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
    });
    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([])
    const [socialStatuses, setSocialStatuses] = useState<SocialStatus[]>([]);

    const fetchFamilyStatuses = async () => {
        try {
            const response = await autocompleteApi.getFamilyStatuses();
            setFamilyStatuses(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки социальных статусов:", error);
        }
    };
    const fetchSocialStatuses = async () => {
        try {
            const response = await autocompleteApi.getSocialStatuses();
            setSocialStatuses(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки социальных статусов:", error);
        }
    };

    useEffect(() => {
        fetchFamilyStatuses()
        fetchSocialStatuses()
    }, [])

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

    const handleInputChange = useCallback(async (field: keyof PersonFromRevisionDocument, value: string) => {
        if (field === "landowner") {
            onRecordChange(record.idDate!, field, {landowner: value, id: undefined, place: null}); // Обновляем как объект
        } else {
            onRecordChange(record.idDate!, field, value); // Обычное текстовое поле
        }

        if (value.length > 1) {
            try {
                let response;
                switch (field) {
                    case "firstName":
                        response = await autocompleteApi.getFirstNames(value);
                        break;
                    case "lastName":
                        response = await autocompleteApi.getLastNames(value);
                        break;
                    case "middleName":
                        response = await autocompleteApi.getMiddleNames(value);
                        break;
                    case "landowner":
                        response = await autocompleteApi.getLandowners(value);
                        break;
                }
                setSuggestions((prev) => ({...prev, [field]: response?.data || []}));
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error);
            }
        } else {
            setSuggestions((prev) => ({...prev, [field]: []}));
        }
    }, []);
    const renderSuggestionInput = (field: keyof PersonFromRevisionDocument, label: string, label2: string) => {
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

                                        // Скрываем все подсказки после выбора
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
    const renderLandownerInput = (field: keyof PersonFromRevisionDocument, label: string, label2: string) => {
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

                                        // Скрываем подсказки после выбора
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

    const renderStatusInput = (field: "familyStatus" | "socialStatus") => {
        const isFamily = field === "familyStatus";
        const statuses = isFamily ? familyStatuses : socialStatuses;

        return (
            <div className="space-y-2">
                <Label className="text-base">
                    {isFamily ? "Семейный статус" : "Социальный статус"}
                </Label>
                <Select
                    value={isFamily ? record.familyStatus?.id?.toString() || "" : record.socialStatus?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedStatus = statuses.find((status) => status.id?.toString() === value) || null;
                        onRecordChange(record.idDate!, field, selectedStatus)
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

    return (
        <div className="p-4 border rounded-lg space-y-3 mb-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
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
            <div className="space-y-2">
                <Label htmlFor="previousAge" className="text-base">Возраст в предыдущей ревизии</Label>
                <Input
                    id="previousAge"
                    type="number"
                    placeholder={'Введите возраст'}
                    value={record.previousAge || ""}
                    min="0"
                    onChange={(e) => onRecordChange(record.idDate!, "previousAge", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="currentAge" className="text-base">Текущий возраст</Label>
                <Input
                    id="currentAge"
                    type="number"
                    placeholder={'Введите возраст'}
                    value={record.currentAge || ""}
                    min="0"
                    onChange={(e) => onRecordChange(record.idDate!, "currentAge", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={`household-${record.idDate}`} className="text-base">
                    Двор
                </Label>
                <Input
                    id={`household-${record.idDate}`}
                    placeholder={'Введите двор'}
                    value={record.household || ""}
                    onChange={(e) => onRecordChange(record.idDate!, "household", e.target.value)}
                />
            </div>

            {renderLandownerInput("landowner", "Землевладелец", "имя землевладельца")}
            {renderStatusInput("familyStatus")}
            {renderStatusInput("socialStatus")}

            <div className="space-y-2">
                <Label htmlFor={`departureYear-${record.idDate}`} className="text-base">
                    Год отъезда
                </Label>
                <Input
                    id={`departureYear-${record.idDate}`}
                    type="number"
                    placeholder="Введите год отъезда"
                    value={record.departureYear || ""}
                    min="0"
                    onChange={(e) => onRecordChange(record.idDate!, "departureYear", e.target.value)}
                    className="h-10 text-base"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor={`departureReason-${record.idDate}`} className="text-base">
                    Причина отъезда
                </Label>
                <Input
                    id={`departureReason-${record.idDate}`}
                    placeholder="Введите причину отъезда"
                    value={record.departureReason || ""}
                    onChange={(e) => onRecordChange(record.idDate!, "departureReason", e.target.value)}
                    className="h-10 text-base"
                />
            </div>

            {record.gender === "FEMALE" && (
                <div className="space-y-2">
                    <Label htmlFor={`marriageDocument-${record.idDate}`} className="text-base">
                        Документ о браке
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id={`marriageDocument-${record.idDate}`}
                            type="checkbox"
                            checked={record.marriageDocument || false}
                            onChange={(e) => onRecordChange(record.idDate!, "marriageDocument", e.target.checked)}
                            className="h-5 w-5"
                        />
                        <span className="text-base">Есть документ</span>
                    </div>
                </div>
            )}

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
