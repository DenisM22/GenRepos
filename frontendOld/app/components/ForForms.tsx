import {useState, useCallback, useEffect} from "react"
import { personApi, autocompleteApi } from "../api/api"
import {Person, FuzzyDate, Uyezd, Volost, Place} from "@/app/types/models"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button";

// Функция для изменения данных формы
export const usePersonForm = (initialPerson: Person = {}) => {
    const [person, setPerson] = useState<Person>(initialPerson)
    const [suggestions, setSuggestions] = useState<{
        firstName: string[];
        lastName: string[];
        middleName: string[];
        volost: Volost[];
        place: Place[];
        spouse: Person[];
        father: Person[];
        mother: Person[];
        children: Person[];
    }>({
        firstName: [],
        lastName: [],
        middleName: [],
        volost: [],
        place: [],
        spouse: [],
        father: [],
        mother: [],
        children: [],
    });


    const [uyezdy, setUyezdy] = useState<Uyezd[]>([]);
    useEffect(() => {
        const fetchUyezdy = async () => {
            try {
                const response = await autocompleteApi.getUyezdy();
                setUyezdy(response.data || []);
            } catch (error) {
                console.error("Ошибка загрузки уездов:", error);
            }
        };

        fetchUyezdy();
    }, []);


    const [showFields, setShowFields] = useState<{ [key: string]: boolean }>({
        spouse: false,
        father: false,
        mother: false,
        children: false
    })

    const handleInputChange = useCallback(async (field: keyof Person, value: string) => {
        setPerson((prev) => ({ ...prev, [field]: value }));

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
                    case "volost":
                        if (person.uyezd?.id && value) {  // Проверка на существование uyezd и значения
                            response = await autocompleteApi.getVolosts(person.uyezd.id, value);
                        }
                        break;
                    case "place":
                        if (person.volost?.id && value) {  // Проверка на существование volost и значения
                            response = await autocompleteApi.getPlaces(person.volost.id, value);
                        }
                        break;
                    case "spouse":
                    case "father":
                    case "mother":
                    case "children":
                        response = await personApi.getAll(value);
                        break;
                }
                console.log(response.data)
                setSuggestions((prev) => ({ ...prev, [field]: response?.data || [] }));
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error);
            }
        } else {
            setSuggestions((prev) => ({ ...prev, [field]: [] }));
        }
    }, [person.uyezd, person.volost]);



    const handleSuggestionClick = (field: keyof Person, suggestion: any) => {
        setPerson((prev) => {
            const newState = { ...prev, [field]: suggestion };

            if (field === "uyezd") {
                return { ...newState, volost: null, place: null };  // Сброс волости и места
            }
            if (field === "volost") {
                return { ...newState, place: null };  // Сброс места
            }
            return newState;
        });

        setSuggestions((prev) => ({ ...prev, [field]: [] }));
    }

    const handleGenderChange = (value: "MALE" | "FEMALE" | "OTHER") => {
        setPerson((prev) => ({...prev, gender: value}))
    }

    const handleDateChange = (field: "birthDate" | "deathDate", key: keyof FuzzyDate, value: string) => {
        setPerson((prev) => ({
            ...prev,
            [field]: {...prev[field], [key]: value},
        }))
    }

    const handleToggleField = (field: keyof typeof showFields) => {
        setShowFields((prev) => ({...prev, [field]: !prev[field]}))
    }

    const renderInput = (field: keyof Person, label: string, isPerson = false) => {
        const isVisible = showFields[field] || !isPerson;

        let value = "";
        if (typeof person[field] === "string") {
            value = person[field] as string;
        } else if (field === "volost" && person.volost) {
            value = person.volost.volost ?? ""; // Берем название волости
        } else if (field === "place" && person.place) {
            value = person.place.place ?? ""; // Берем название места
        } else if (isPerson && person[field]) {
            value = `${(person[field] as Person).lastName} ${(person[field] as Person).firstName} ${(person[field] as Person).middleName ?? ""}`;
        }

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
                                {(suggestions[field] as (string | Person | Volost | Place)[]).map((suggestion, index) => {
                                    let displayText = "";

                                    if (typeof suggestion === "string") {
                                        // Если suggestion - это строка, выводим её
                                        displayText = suggestion;
                                    } else if ("lastName" in suggestion) {
                                        // Если suggestion - это объект Person
                                        displayText = `${suggestion.lastName} ${suggestion.firstName} ${suggestion.middleName ?? ""}, ${
                                            suggestion.birthDate?.exactDate?.split("-")[0] || "—"
                                        }`;
                                    } else if ("volost" in suggestion) {
                                        // Если suggestion - это объект Volost
                                        displayText = suggestion.volost;
                                    } else if ("place" in suggestion) {
                                        // Если suggestion - это объект Place, и мы получаем строку `place`
                                        displayText = suggestion.place ?? "";  // Убедимся, что берем строку
                                    } else {
                                        displayText = "Неизвестное значение";  // Если не подходит под шаблоны выше
                                    }

                                    return (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSuggestionClick(field, suggestion)}
                                        >
                                            {displayText}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                    </div>
                )}
            </div>
        );
    };

    const renderGenderInput = () => {
        return (
            <div>
                <label className="block mb-1 text-gray-700">Пол</label>
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

    const renderUyezdInput = () => {
        return (
            <div>
                <label className="block mb-1 text-gray-700">Уезд</label>
                <Select
                    value={person.uyezd?.id?.toString() || ""}
                    onValueChange={(value) => {
                        const selectedUyezd = uyezdy.find((u) => u.id?.toString() === value) || null;
                        setPerson((prev) => ({
                            ...prev,
                            uyezd: selectedUyezd,
                        }));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите уезд" />
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
            </div>
        );
    };

    return {
        renderInput,
        renderGenderInput,
        renderDateInput,
        renderUyezdInput,
        person
    }
}

