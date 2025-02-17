"use client"

import {useCallback, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {UserPlus} from "lucide-react"
import {cn} from "@/lib/utils"
import {autocompleteApi, personApi} from "../api/api"
import {FuzzyDate, Person} from "@/app/types/models"

export default function AddPersonForm() {
    const [message, setMessage] = useState('')
    const [person, setPerson] = useState<Person>({})
    const [suggestions, setSuggestions] = useState<{
        firstName: string[];
        lastName: string[];
        middleName: string[];
        place: string[];
        spouse: Person[];
        father: Person[];
        mother: Person[];
        children: Person[];
    }>({
        firstName: [],
        lastName: [],
        middleName: [],
        place: [],
        spouse: [],
        father: [],
        mother: [],
        children: []
    })

    const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({
        spouse: false,
        father: false,
        mother: false,
        children: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            await personApi.save(person)
            console.log("Человек успешно сохранен")
            setMessage("Человек успешно сохранен")
            setPerson({})
        } catch (error) {
            console.error("Ошибка при сохранении человека:", error)
        }
    }

    const handleInputChange = useCallback(async (field: keyof Person, value: string) => {
        setPerson((prev) => ({...prev, [field]: value}))
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
                    case "place":
                      response = await autocompleteApi.getPlaces(value)
                      break
                    case "spouse":
                    case "father":
                    case "mother":
                    case "children":
                        response = await personApi.getAll(value)
                        break
                }
                setSuggestions((prev) => ({...prev, [field]: response?.data || []}))
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error)
            }
        } else {
            setSuggestions((prev) => ({...prev, [field]: []}))
        }
    }, [])

    const handleSuggestionClick = (field: keyof Person, suggestion: string | Person) => {
        setPerson((prev) => ({
            ...prev,
            [field]: typeof suggestion === "string" ? suggestion : { ...suggestion }, // Если Person, сохраняем объект
        }));
        setSuggestions((prev) => ({ ...prev, [field]: [] })); // Очищаем подсказки после выбора
    };

    const handleGenderChange = (value: "MALE" | "FEMALE" | "OTHER") => {
        setPerson((prev) => ({...prev, gender: value}))
    }

    const handleDateChange = (field: "birthDate" | "deathDate", key: keyof FuzzyDate, value: string) => {
        setPerson((prev) => ({
            ...prev,
            [field]: {...prev[field], [key]: value},
        }))
    }

    const renderDateInput = (field: "birthDate" | "deathDate", label: string) => {
        const date = person[field]

        return (
            <div>
                <label className="block mb-1 text-gray-700">{label}</label>
                <Select
                    value={date?.description || ""}
                    onValueChange={(value) => handleDateChange(field, "description", value)}
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
                        required={true}
                        value={date?.exactDate || ""}
                        onChange={(e) => handleDateChange(field, "exactDate", e.target.value)}
                        className="mt-2"
                    />
                )}

                {date?.description === "Диапазон" && (
                    <div className="mt-2 flex gap-2">
                        <Input
                            type="date"
                            placeholder="Начальная дата"
                            required={true}
                            value={date.startDate || ""}
                            onChange={(e) => handleDateChange(field, "startDate", e.target.value)}
                        />
                        <Input
                            type="date"
                            placeholder="Конечная дата"
                            required={true}
                            value={date.endDate || ""}
                            onChange={(e) => handleDateChange(field, "endDate", e.target.value)}
                        />
                    </div>
                )}

            </div>
        )
    }

    const renderInput = (field: keyof Person, label: string, isPerson = false, multiple = false) => {
        const isVisible = showFields[field] || !isPerson;
        const value =
            typeof person[field] === "string"
                ? (person[field] as string)
                : isPerson && person[field]
                    ? `${(person[field] as Person).lastName} ${(person[field] as Person).firstName} ${(person[field] as Person).middleName ?? ""}`
                    : ""

        return (
            <div className="mt-2">
                {isPerson && (
                    <Button type="button" onClick={() => handleToggleField(field)}>
                        {isVisible ? `Скрыть ${label.toLowerCase()}` : `Добавить ${label.toLowerCase()}`}
                    </Button>
                )}

                {isVisible && (
                    <div className="relative mt-2">
                        <Input
                            placeholder={isPerson ? `Введите имя ${label.toLowerCase()}` : `Введите ${label.toLowerCase()}`}
                            value={value}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="w-full"
                        />


                        {suggestions[field]?.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                                {(suggestions[field] as (string | Person)[]).map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSuggestionClick(field, suggestion)}
                                    >
                                        {typeof suggestion === "string"
                                            ? suggestion
                                            : `${suggestion.lastName} ${suggestion.firstName} ${suggestion.middleName ?? ""} (${suggestion.birthDate?.exactDate?.split("-")[0] || "—"})`}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                )}
            </div>
        );
    };

    const handleToggleField = (field: keyof typeof showFields) => {
        setShowFields((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                    <UserPlus className="mr-2"/>
                    Добавить нового человека
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderInput("lastName", "фамилию")}
                    {renderInput("firstName", "имя")}
                    {renderInput("middleName", "отчество")}

                    {/* Выбор пола */}
                    <div>
                        <Select value={person.gender} onValueChange={handleGenderChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите пол"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Мужской</SelectItem>
                                <SelectItem value="FEMALE">Женский</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {renderDateInput("birthDate", "Дата рождения")}
                    {renderDateInput("deathDate", "Дата смерти")}
                    {renderInput("place", "место рождения")}
                    {renderInput("spouse", "супругу", true)}
                    {renderInput("father", "отца", true)}
                    {renderInput("mother", "мать", true)}
                    {renderInput("children", "детей", true)}
                    <Button type="submit" className="w-full">
                        Добавить человека
                    </Button>
                </form>
            </CardContent>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </Card>
    )
}
