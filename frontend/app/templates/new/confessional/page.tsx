"use client"

import type React from "react"
import {useCallback, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import Header from "@/components/header"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {templateConfessionalStore} from "@/app/types/templateStore"
import {toast} from "@/components/ui/use-toast"
import {Calendar, MapPin, Save} from "lucide-react"
import {FamilyStatus, FuzzyDate, Landowner, Place, SocialStatus, Template, Uyezd, Volost} from "@/app/types/models"
import {autocompleteApi} from "@/app/api/api"

export default function AddTemplate() {
    const router = useRouter()
    const [message, setMessage] = useState('')
    const [template, setTemplate] = useState<Omit<Template, "id">>({
        name: "",
        firstName: "",
        lastName: "",
        middleName: "",
        gender: "MALE",
        birthDate: null,
        deathDate: null,
        uyezd: null,
        volost: null,
        place: null,
        household: "",
        landowner: null,
        familyStatus: null,
        socialStatus: null,
    })
    const [suggestions, setSuggestions] = useState({
        names: {firstName: [], lastName: [], middleName: [], landowner: []},
    })
    const [uyezdy, setUyezdy] = useState<Uyezd[]>([])
    const [volosts, setVolosts] = useState<Volost[]>([])
    const [places, setPlaces] = useState<Place[]>([])
    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([])
    const [socialStatuses, setSocialStatuses] = useState<SocialStatus[]>([])

    useEffect(() => {
        fetchUyezdy()
        fetchFamilyStatuses()
        fetchSocialStatuses()
    }, [])

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!template.name.trim()) {
            setMessage("Укажите название шаблона")
            return
        }

        const newTemplate: Template = {
            ...template,
            id: Date.now().toString(),
        }
        templateConfessionalStore.addTemplate(newTemplate)
        toast({
            title: "Шаблон добавлен",
            description: "Новый шаблон успешно создан",
        })
        router.back()
    }

    const handleInputChange = useCallback(async (field: keyof typeof template, value: string) => {
        if (field === "landowner") {
            setTemplate((prev) => ({...prev, [field]: {landowner: value, id: undefined, place: null}}))
        } else {
            setTemplate((prev) => ({...prev, [field]: value}))
        }

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
                    case "landowner":
                        response = await autocompleteApi.getLandowners(value)
                        break
                }

                setSuggestions((prev) => ({...prev, names: {...prev.names, [field]: response?.data || []}}))

            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error)
            }
        } else {
            setSuggestions((prev) => ({...prev, names: {...prev.names, [field]: []}}))
        }
    }, [])
    const renderSuggestionInput = (field: keyof typeof template, label: string, label2: string) => {
        const value = template[field] as string

        return (
            <div className="relative space-y-2">
                <Label htmlFor={field} className="text-base">
                    {label}
                </Label>
                <Input
                    placeholder={`Введите ${label2}`}
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full"
                />

                {suggestions.names[field]?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(suggestions.names[field] as string[]).map((suggestion, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setTemplate((prev) => ({...prev, [field]: suggestion}))
                                    setSuggestions({
                                        names: {
                                            firstName: [],
                                            lastName: [],
                                            middleName: [],
                                            landowner: []
                                        }
                                    })
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }
    const renderLandownerInput = () => {
        const value = template.landowner?.landowner || ""

        return (
            <div className="relative space-y-2">
                <Label htmlFor="landowner" className="text-base">
                    Землевладелец
                </Label>
                <Input
                    placeholder="Введите имя землевладельца"
                    value={value}
                    onChange={(e) => handleInputChange("landowner", e.target.value)}
                    className="w-full"
                />

                {suggestions.names.landowner?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(suggestions.names.landowner as Landowner[]).map((suggestion, index) => {
                            const displayText = `${suggestion.landowner} (${suggestion.place?.place || "—"})`;

                            return (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setTemplate((prev) => ({...prev, landowner: suggestion}))
                                        setSuggestions({
                                            names: {
                                                firstName: [],
                                                lastName: [],
                                                middleName: [],
                                                landowner: []
                                            }
                                        })
                                    }}
                                >
                                    {displayText}
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
                <Select value={template.gender} onValueChange={(value) => setTemplate((prev) => ({
                    ...prev,
                    gender: value as "MALE" | "FEMALE"
                }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите пол"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MALE">Мужской</SelectItem>
                        <SelectItem value="FEMALE">Женский</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        )
    }

    const renderDateInput = (field: "birthDate" | "deathDate", label: string) => {
        const date = template[field]

        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4"/>
                    {label}
                </Label>
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
    const handleDateChange = (field: "birthDate" | "deathDate", key: keyof FuzzyDate, value: string) => {
        setTemplate((prev) => ({
            ...prev,
            [field]: {...prev[field], [key]: value},
        }))
    }

    const renderLocationSelectors = () => {
        return (
            <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4"/>
                    Место рождения
                </Label>

                <Select
                    value={template.uyezd?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedUyezd = uyezdy.find((u) => u.id?.toString() === value) || null
                        setTemplate((prev) => ({...prev, uyezd: selectedUyezd}))
                        fetchVolosts(selectedUyezd?.id!)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите уезд"/>
                    </SelectTrigger>
                    <SelectContent>
                        {uyezdy.map((uyezd) => (
                            <SelectItem key={uyezd.id} value={uyezd.id?.toString() || ""}>
                                {uyezd.uyezd}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    disabled={!template.uyezd}
                    value={template.volost?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedVolost = volosts.find((v) => v.id?.toString() === value) || null
                        setTemplate((prev) => ({...prev, volost: selectedVolost}))
                        fetchPlaces(selectedVolost?.id!)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите волость"/>
                    </SelectTrigger>
                    <SelectContent>
                        {volosts.map((volost) => (
                            <SelectItem key={volost.id} value={volost.id?.toString() || ""}>
                                {volost.volost}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    disabled={!template.volost}
                    value={template.place?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedPlace = places.find((p) => p.id?.toString() === value) || null
                        setTemplate((prev) => ({...prev, place: selectedPlace}))
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите место"/>
                    </SelectTrigger>
                    <SelectContent>
                        {places.map((place) => (
                            <SelectItem key={place.id} value={place.id?.toString() || ""}>
                                {place.place}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }

    const renderStatusInput = (field: "familyStatus" | "socialStatus") => {
        const isFamily = field === "familyStatus"
        const statuses = isFamily ? familyStatuses : socialStatuses

        return (
            <div className="space-y-2">
                <Label className="text-base">
                    {isFamily ? "Семейный статус" : "Социальный статус"}
                </Label>
                <Select
                    value={template[field]?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedStatus = statuses.find((status) => status.id?.toString() === value) || null
                        setTemplate((prev) => ({...prev, [field]: selectedStatus}))
                    }}
                >
                    <SelectTrigger>
                        <SelectValue
                            placeholder={isFamily ? "Выберите семейный статус" : "Выберите социальный статус"}/>
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((status) => (
                            <SelectItem key={status.id} value={status.id?.toString() || ""}>
                                {isFamily ? status.familyStatus : status.socialStatus}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Добавить новый шаблон
                    </h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация о шаблоне</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Название шаблона</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={template.name}
                                        onChange={(e) => setTemplate((prev) => ({...prev, name: e.target.value}))}
                                        placeholder="Например: Родитель"
                                        required
                                    />
                                </div>
                                {renderSuggestionInput("lastName", "Фамилия", "фамилию")}
                                {renderSuggestionInput("firstName", "Имя", "имя")}
                                {renderSuggestionInput("middleName", "Отчество", "отчество")}
                                {renderGenderInput()}
                                {renderDateInput("birthDate", "Дата рождения")}
                                {renderDateInput("deathDate", "Дата смерти")}
                                {renderLocationSelectors()}
                                <div className="space-y-2">
                                    <Label htmlFor="household" className="text-base">Двор</Label>
                                    <Input
                                        id="household"
                                        name="household"
                                        value={template.household}
                                        onChange={(e) => setTemplate((prev) => ({...prev, household: e.target.value}))}
                                        placeholder="Двор"
                                        className="h-10 text-base"
                                    />
                                </div>
                                {renderLandownerInput()}
                                {renderStatusInput("familyStatus")}
                                {renderStatusInput("socialStatus")}
                            </form>
                            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSubmit} className="w-full">
                                <Save className="mr-2 h-4 w-4"/> Сохранить шаблон
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}
