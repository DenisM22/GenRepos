import {
    ConfessionalDocument,
    FamilyStatus,
    FuzzyDate,
    Person,
    PersonFromConfessionalDocument, PersonFromRevisionDocument, RevisionDocument,
    SocialStatus,
    Uyezd
} from "@/app/types/models";
import React, {useCallback, useState} from "react";
import {autocompleteApi, personApi} from "@/app/api/api";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {MapPin} from "lucide-react";

export const usePersonDocumentForm = () => {
    const [confessionalDocument, setConfessionalDocument] = useState<ConfessionalDocument>({people: []});
    const [revisionDocument, setRevisionDocument] = useState<ConfessionalDocument>({})
    const [uyezdy, setUyezdy] = useState<Uyezd[]>([])
    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
    const [socialStatuses, setSocialStatuses] = useState<SocialStatus[]>([]);
    const [suggestions, setSuggestions] = useState({
        names: {firstName: [], lastName: [], middleName: []},
        locations: {volost: [], place: [], parish: []},
        relatives: {spouse: [], father: [], mother: [], children: []},
    });

    //Fetch
    const fetchUyezdy = async () => {
        try {
            const response = await autocompleteApi.getUyezdy();
            setUyezdy(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки уездов:", error);
        }
    };

    const fetchFamilyStatuses = async () => {
        try {
            const response = await autocompleteApi.getSocialStatuses();
            setSocialStatuses(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки статусов:", error);
        }
    };

    const fetchSocialStatuses = async () => {
        try {
            const response = await autocompleteApi.getSocialStatuses();
            setSocialStatuses(response.data || []);
        } catch (error) {
            console.error("Ошибка загрузки статусов:", error);
        }
    };

    //ConfessionalDocument
    const renderParishInputConfessionalDocument = () => {
        return (

            <div className="mt-2">
                <div className="space-y-2">
                    <Label htmlFor="parish" className="text-base">
                        Приход
                    </Label>
                    <div className="relative">
                        <Input
                            id="parish"
                            name="parish"
                            placeholder="Например: Петропавловский"
                            value={confessionalDocument.parish?.parish}
                            onChange={(e) => handleInputChangeConfessionalDocument("parish", e.target.value)}
                            className="pl-10 h-12 text-base"
                        />
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground"/>
                    </div>
                </div>

                    {suggestions.locations.parish.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {suggestions.locations.parish.map((parish, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSuggestionClickConfessionalDocument("parish", parish)}
                                >
                                    {parish.parish}
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        );
    };

    const handleInputChangeConfessionalDocument = useCallback(async (field: keyof ConfessionalDocument, value: string) => {
        setConfessionalDocument((prev) => ({
            ...prev,
            [field]: typeof prev[field] === "object"
                ? { ...prev[field], parish: value }
                : value,
        }));

        if (value.length > 1) {
            try {
                let response;
                if (field === "parish") {
                    response = await autocompleteApi.getParishes(value);
                    setSuggestions((prev) => ({
                        ...prev,
                        locations: {
                            ...prev.locations,
                            parish: response?.data || [],
                        },
                    }));
                }
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error);
            }
        } else {
            setSuggestions((prev) => ({
                ...prev,
                locations: {
                    ...prev.locations,
                    parish: [],
                },
            }));
        }
    }, []);

    const handleSuggestionClickConfessionalDocument = (field: keyof ConfessionalDocument, suggestion: any) => {
        setConfessionalDocument((prev) => {
            return {...prev, [field]: suggestion};
        });

        setSuggestions({
            names: {firstName: [], lastName: [], middleName: []},
            locations: {volost: [], place: [], parish: []},
            relatives: {spouse: [], father: [], mother: [], children: []},
        });
    };


    //ConfessionalPerson
    const renderNameSuggestion = (
        field: "firstName" | "lastName" | "middleName",
        label: string,
        personIndex?: number
    ) => {
        const value =
            personIndex !== undefined
                ? confessionalDocument.people?.[personIndex]?.[field] ?? ""
                : confessionalDocument[field] ?? "";

        const personSuggestions = personIndex !== undefined ? suggestions.names[personIndex]?.[field] || [] : [];

        return (
            <div className="space-y-2">
                <Label htmlFor={personIndex !== undefined ? `${field}-${personIndex}` : field}>{label}</Label>
                <div className="relative">
                    <Input
                        id={personIndex !== undefined ? `${field}-${personIndex}` : field}
                        name={field}
                        type="text"
                        value={value}
                        onChange={(e) => changeSuggestion(field, e.target.value, personIndex)}
                        placeholder={`Введите ${label.toLowerCase()}`}
                        className="w-full"
                    />

                    {personSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                            {personSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => clickSuggestion(field, suggestion, personIndex)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    };

    const changeSuggestion = useCallback(
        async (field: "firstName" | "lastName" | "middleName", value: string, personIndex?: number) => {
            setConfessionalDocument((prev) => {
                const updatedDoc = { ...prev };

                if (personIndex !== undefined) {
                    if (!updatedDoc.people) updatedDoc.people = [];
                    if (!updatedDoc.people[personIndex]) updatedDoc.people[personIndex] = {} as PersonFromConfessionalDocument;
                    updatedDoc.people[personIndex][field] = value;
                } else {
                    updatedDoc[field] = value;
                }

                return updatedDoc;
            });

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
                    }
                    setSuggestions((prev) => ({
                        ...prev,
                        names: {
                            ...prev.names,
                            [personIndex ?? -1]: {
                                ...(prev.names[personIndex ?? -1] || { firstName: [], lastName: [], middleName: [] }),
                                [field]: response?.data || [],
                            },
                        },
                    }));
                } catch (error) {
                    console.error(`Ошибка загрузки ${field}:`, error);
                }
            } else {
                setSuggestions((prev) => ({
                    ...prev,
                    names: {
                        ...prev.names,
                        [personIndex ?? -1]: {
                            ...(prev.names[personIndex ?? -1] || { firstName: [], lastName: [], middleName: [] }),
                            [field]: [],
                        },
                    },
                }));
            }
        },
        []
    );

    const clickSuggestion = (field: "firstName" | "lastName" | "middleName", suggestion: string, personIndex?: number) => {
        setConfessionalDocument((prev) => {
            const updatedDoc = { ...prev };

            if (personIndex !== undefined) {
                if (!updatedDoc.people) updatedDoc.people = [];
                if (!updatedDoc.people[personIndex]) updatedDoc.people[personIndex] = {} as PersonFromConfessionalDocument;
                updatedDoc.people[personIndex][field] = suggestion;
            } else {
                updatedDoc[field] = suggestion;
            }

            return updatedDoc;
        });

        setSuggestions((prev) => ({
            ...prev,
            names: {
                ...prev.names,
                [personIndex ?? -1]: {
                    ...(prev.names[personIndex ?? -1] || { firstName: [], lastName: [], middleName: [] }),
                    [field]: [],
                },
            },
        }));
    };





    return {
        renderParishInputConfessionalDocument,
        renderNameSuggestion,
        fetchUyezdy,
        fetchFamilyStatuses,
        fetchSocialStatuses,
        confessionalDocument,
    }
}
