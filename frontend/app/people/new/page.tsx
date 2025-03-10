"use client"

import React, {useCallback, useEffect, useState} from "react"
import {motion} from "framer-motion"
import {Calendar, MapPin, Plus, Save, User, Users, X} from "lucide-react"
import Header from "@/components/header"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {FuzzyDate, Person, Place, SocialStatus, Uyezd, Volost} from "@/app/types/models"
import {autocompleteApi, personApi} from "@/app/api/api";

export default function AddPerson() {
    const [message, setMessage] = useState('')
    const [person, setPerson] = useState<Person>({
        gender: "MALE",
    })
    const [uyezdy, setUyezdy] = useState<Uyezd[]>([])
    const [volosts, setVolosts] = useState<Volost[]>([])
    const [places, setPlaces] = useState<Place[]>([])
    const [socialStatuses, setSocialStatuses] = useState<SocialStatus[]>([]);
    const [suggestions, setSuggestions] = useState({
        names: {firstName: [], lastName: [], middleName: []},
        relatives: {spouse: [], father: [], mother: [], children: []},
    });
    const [activeField, setActiveField] = useState<{ field: keyof Person; index?: number } | null>(null);

    useEffect(() => {
        fetchUyezdy()
        fetchSocialStatuses()
    }, [])

    const fetchUyezdy = async () => {
        try {
            const response = await autocompleteApi.getUyezdy();
            setUyezdy(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки уездов:", error);
        }
    };
    const fetchVolosts = async (uyezdId: number) => {
        try {
            const response = await autocompleteApi.getVolosts(uyezdId);
            setVolosts(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки волостей:", error);
        }
    };
    const fetchPlaces = async (volostId: number) => {
        try {
            const response = await autocompleteApi.getPlaces(volostId);
            setPlaces(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки мест:", error);
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

    const validatePerson = (person: Person): string | null => {

        if (!person.firstName?.trim() || !person.lastName?.trim()) {
            return "Укажите имя и фамилию";
        }
        if (person.lastName?.trim().length < 2) {
            return "Фамилия должна содержать хотя бы 2 символа";
        }
        if (person.firstName?.trim().length < 2) {
            return "Имя должно содержать хотя бы 2 символа";
        }
        return null;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validatePerson(person);
        if (validationError) {
            setMessage(validationError);
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return;
        }

        try {
            await personApi.save(person);
            setPerson({
                id: undefined,
                firstName: "",
                lastName: "",
                middleName: "",
                gender: "MALE",
                birthDate: undefined,
                deathDate: undefined,
                uyezd: null,
                volost: null,
                place: null,
                socialStatus: null,
                spouse: undefined,
                father: undefined,
                mother: undefined,
                children: [],
            });
            console.log("Человек успешно сохранен");
            setMessage("Человек успешно сохранен");
        } catch (error) {
            console.error("Ошибка при сохранении человека:", error);
            setMessage("Ошибка при сохранении человека: " + error);
        }
        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    const handleInputChange = useCallback(async (field: keyof Person, value: string, index?: number) => {
        setActiveField({field, index}); // Запоминаем, в каком поле идет ввод

        setPerson((prev) => ({
            ...prev,
            [field]:
                field === "children"
                    ? prev.children
                        ? prev.children.map((child, i) => (i === index ? {...child, firstName: value} : child))
                        : []
                    : typeof prev[field] === "object" && prev[field] !== null
                        ? {...(prev[field] as Person), firstName: value}
                        : value,
        }));

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
                    case "spouse":
                    case "father":
                    case "mother":
                    case "children":
                        response = await personApi.getAll(value);
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
    const renderSuggestionInput = (field: keyof Person, label: string, label2: string) => {
        const value = person[field] as string;

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

                {suggestions[field]?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(suggestions[field] as string[]).map((suggestion, index) => {

                            return (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setPerson((prev) => {
                                            return {...prev, [field]: suggestion};
                                        });
                                        // Скрываем все подсказки после выбора
                                        setSuggestions({
                                            names: {firstName: [], lastName: [], middleName: []},
                                            relatives: {spouse: [], father: [], mother: [], children: []},
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
                <Select value={person.gender || "MALE"} onValueChange={handleGenderChange}>
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
        setPerson((prev) => ({...prev, gender: value}))
    }

    const renderDateInput = (field: "birthDate" | "deathDate", label: string) => {
        const date = person[field]

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
        setPerson((prev) => ({
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

                {/* Уезд */}
                <Select
                    value={person.uyezd?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedUyezd = uyezdy.find((u) => u.id?.toString() === value) || null;
                        setPerson((prev) => ({
                            ...prev,
                            uyezd: selectedUyezd,
                            volost: null,
                            place: null,
                        }));
                        fetchVolosts(selectedUyezd?.id)
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
                    disabled={!person.uyezd}
                    value={person.volost?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedVolost = volosts.find((v) => v.id?.toString() === value) || null;
                        setPerson((prev) => ({
                            ...prev,
                            volost: selectedVolost,
                            place: null,
                        }));
                        fetchPlaces(selectedVolost?.id)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите волость"/>
                    </SelectTrigger>
                    <SelectContent>
                        {person.uyezd && volosts.length > 0 ? (
                            volosts
                                .map((volost) => (
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
                    disabled={!person.volost}
                    value={person.place?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedPlace = places.find((p) => p.id?.toString() === value) || null;
                        setPerson((prev) => ({
                            ...prev,
                            place: selectedPlace,
                        }));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите место"/>
                    </SelectTrigger>
                    <SelectContent>
                        {person.volost && places.length > 0 ? (
                            places
                                .map((place) => (
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
    const renderStatusInput = (field: "familyStatus" | "socialStatus") => {
        const isFamily = field === "familyStatus";
        const statuses = isFamily ? familyStatuses : socialStatuses;

        return (
            <div className="space-y-2">
                <Label className="text-base">
                    {isFamily ? "Семейный статус" : "Социальный статус"}
                </Label>
                <Select
                    value={isFamily ? person.familyStatus?.id?.toString() || "" : person.socialStatus?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedStatus = statuses.find((status) => status.id?.toString() === value) || null;
                        setPerson((prev) => ({
                            ...prev,
                            [field]: selectedStatus,
                        }));
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

    const renderRelativeInput = (field: keyof Person, label1: string, label2: string, index?: number) => {
        const value =
            field === "children"
                ? person.children?.[index!]?.firstName || ""
                : typeof person[field] === "object" && person[field] !== null
                    ? (person[field] as Person).firstName ?? ""
                    : person[field] ?? "";

        return (
            <div className="relative space-y-2">
                <Label htmlFor={field}>{label1}</Label>
                <Input
                    id={field}
                    placeholder={`Введите имя ${label2}`}
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value, index)}
                    className="w-full"
                />

                {activeField?.field === field && activeField?.index === index &&
                    Array.isArray(suggestions[field]) && suggestions[field]?.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {(suggestions[field] as Person[]).map((suggestion, suggestionIndex) => {
                                const birthYear = suggestion.birthDate?.exactDate?.split("-")[0] || "—";
                                const displayText = `${suggestion.lastName} ${suggestion.firstName} ${suggestion.middleName ?? ""}, ${birthYear}`;

                                return (
                                    <li
                                        key={suggestionIndex}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setPerson((prev) => ({
                                                ...prev,
                                                ...(field === "children"
                                                    ? {
                                                        children: prev.children
                                                            ? prev.children.map((child, i) => (i === index ? suggestion : child))
                                                            : [suggestion],
                                                    }
                                                    : {[field]: suggestion}),
                                            }));

                                            // Скрываем подсказки после выбора
                                            setSuggestions((prev) => ({...prev, [field]: []}));
                                            setActiveField(null);
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
    const addRelative = (type: "father" | "mother" | "spouse" | "child") => {
        if (type === "child") {
            setPerson((prev) => ({
                ...prev,
                children: [...(prev.children || []), {firstName: ""}],
            }))
        } else {
            setPerson((prev) => ({
                ...prev,
                [type]: {firstName: ""},
            }))
        }
    }
    const removeRelative = (e: React.MouseEvent, type: "father" | "mother" | "spouse" | "child", index?: number) => {
        e.preventDefault()
        if (type === "child" && typeof index === "number") {
            setPerson((prev) => ({
                ...prev,
                children: prev.children?.filter((_, i) => i !== index),
            }))
        } else {
            setPerson((prev) => ({...prev, [type]: null}))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Добавить человека
                    </h1>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <User className="h-6 w-6 text-primary"/>
                                Информация о человеке
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {renderSuggestionInput("lastName", "Фамилия", "фамилию")}
                                {renderSuggestionInput("firstName", "Имя", "имя")}
                                {renderSuggestionInput("middleName", "Отчество", "отчество")}
                                {renderGenderInput()}
                                {renderDateInput("birthDate", "Дата рождения")}
                                {renderDateInput("deathDate", "Дата смерти")}
                                {renderLocationSelectors()}
                                {renderStatusInput("socialStatus")}

                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="relatives">
                                        <AccordionTrigger>
                                            <Users className="h-4 w-4 mr-2 !rotate-0 !transform-none"/>
                                            Родственники
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-base">Родители</Label>

                                                    {person.father && (
                                                        <div className="border p-4 rounded-md relative">
                                                            {renderRelativeInput("father", "Отец", "отца", 1)}
                                                            <Button
                                                                onClick={(e) => removeRelative(e, "father")}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {person.mother && (
                                                        <div className="border p-4 rounded-md relative">
                                                            {renderRelativeInput("mother", "Мать", "матери", 1)}
                                                            <Button
                                                                onClick={(e) => removeRelative(e, "mother")}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    {!person.father && (
                                                        <Button onClick={() => addRelative("father")} variant="outline"
                                                                className="flex-1">
                                                            <Plus className="mr-2 h-4 w-4"/> Добавить отца
                                                        </Button>
                                                    )}
                                                    {!person.mother && (
                                                        <Button onClick={() => addRelative("mother")} variant="outline"
                                                                className="flex-1">
                                                            <Plus className="mr-2 h-4 w-4"/> Добавить мать
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base">Супруг(а)</Label>
                                                    {!person.spouse && (
                                                        <Button onClick={() => addRelative("spouse")} variant="outline"
                                                                className="w-full">
                                                            <Plus className="mr-2 h-4 w-4"/> Добавить супругу/супруга
                                                        </Button>
                                                    )}
                                                    {person.spouse && (
                                                        <div className="border p-4 rounded-md relative">
                                                            {renderRelativeInput("spouse", "Супруг(а)", "супруги/супруга", 1)}
                                                            <Button
                                                                onClick={(e) => removeRelative(e, "spouse")}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-base">Дети</Label>
                                                    {person.children?.map((child, index) => (
                                                        <div key={index}
                                                             className="border p-4 rounded-md relative">
                                                            {renderRelativeInput("children", `Ребенок ${index + 1}`, `ребенка ${index + 1}`, index)}
                                                            <Button
                                                                onClick={(e) => removeRelative(e, "child", index)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                            >
                                                                <X className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            addRelative("child")
                                                        }}
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        <Plus className="mr-2 h-4 w-4"/> Добавить ребенка
                                                    </Button>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </form>
                        </CardContent>
                        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSubmit} className="gap-2 text-base">
                                <Save className="h-5 w-5"/>
                                Сохранить
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}
