"use client"

import React, {useCallback, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion} from "framer-motion"
import {Calendar, Check, ChevronLeft, ChevronRight, Church, FileText, Plus, Save, Users, X,} from "lucide-react"
import Header from "@/components/header"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ConfessionalDocument, FuzzyDate, Parish, PersonFromConfessionalDocument, Template,} from "@/app/types/models"
import {templateConfessionalStore} from "@/app/types/templateStore"
import {toast} from "@/components/ui/use-toast"
import {RecordForm} from "@/components/RecordForm"
import {autocompleteApi, confessionalDocumentApi} from "@/app/api/api";

// Шаги процесса добавления документа
const steps = [
    {id: 1, title: "Основная информация", icon: FileText},
    {id: 2, title: "Записи документа", icon: Users},
    {id: 3, title: "Подтверждение", icon: Check},
]

export default function AddDocument() {
    const router = useRouter()
    const [message, setMessage] = useState('')

    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)

    const [document, setDocument] = useState<ConfessionalDocument>({
        people: []
    })
    const [parishes, setParishes] = useState<Parish[]>([])

    const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
    const [templates, setTemplates] = useState<Template[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

    useEffect(() => {
        setTemplates(templateConfessionalStore.getTemplates())
    }, [])

    // Обработчик изменения основных полей документа
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setDocument((prev) => ({...prev, [name]: value}))
    }

    // Обработчик изменения года создания документа
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const createdAt = Number.parseInt(value, 10)
        if (!isNaN(createdAt) && createdAt > 0 && createdAt <= new Date().getFullYear()) {
            setDocument((prev) => ({...prev, createdAt: value}))
        }
    }

    // Обработчик изменения записи
    const handleRecordChange = useCallback((idDate: number, field: string, value: any, key?: keyof FuzzyDate) => {
        setDocument((prev) => ({
            ...prev,
            people: prev.people.map((record) =>
                record.idDate === idDate
                    ? {
                        ...record,
                        [field]: key
                            ? {...record[field], [key]: value}  // Обновляем вложенное поле
                            : value,  // Просто заменяем значение, если ключа нет
                    }
                    : record
            ),
        }));
    }, [])

    // Обработчик удаления записи
    const removeRecord = useCallback((idDate: number) => {
        setDocument((prev) => ({
            ...prev,
            people: prev.people.filter((record) => record.idDate !== idDate),
        }))
    }, [])

    // Переход к следующему шагу
    const nextStep = () => {
        if (step == 1 && validateDocument(document)) {
            setMessage(validateDocument(document))
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return
        }
        if (step == 2 && validateRecords(document?.people)) {
            setMessage(validateRecords(document.people))
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return
        }
        if (step < steps.length) {
            setDirection(1)
            setStep((prev) => prev + 1)
        }
    }

    // Переход к предыдущему шагу
    const prevStep = () => {
        if (step > 1) {
            setDirection(-1)
            setStep((prev) => prev - 1)
        }
    }

    const validateDocument = (document: ConfessionalDocument): string | null => {
        if (!document.title?.trim()) {
            return `Укажите название документа`
        }
        return null;
    };
    const validateRecords = (people: PersonFromConfessionalDocument[]): string | null => {
        for (const person of people) {
            if (!person.firstName?.trim() || !person.lastName?.trim()) {
                return `Укажите имя и фамилию для каждой записи`;
            }
            if (person.lastName?.trim().length < 2) {
                return `Фамилия каждой записи должна содержать хотя бы 2 символа`;
            }
            if (person.firstName?.trim().length < 2) {
                return `Имя каждой записи должно содержать хотя бы 2 символа`;
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await confessionalDocumentApi.save(document);
            router.push("/documents/new")
            console.log("Документ успешно сохранен");
        } catch (error) {
            console.error("Ошибка при сохранении документа:", error);
            setMessage("Ошибка при сохранении документа:" + error)
        }
    }

    // Обновленный обработчик выбора шаблона
    const handleTemplateSelect = (templateId: string) => {
        const selected = templateConfessionalStore.getTemplateById(templateId)
        if (selected) {
            setCurrentTemplate(selected)
            setSelectedTemplateId(templateId)
        }
    }

    // Обновленная функция отмены выбора шаблона
    const cancelTemplateSelection = () => {
        setCurrentTemplate(null)
        setSelectedTemplateId(null)
    }

    // Обновленная функция addNewTemplate
    const addNewTemplate = async () => {
        const documentToSave = {
            ...document,
            people: document.people.map((record) => ({
                ...record,
                image: record.image || "",
                imageDescription: record.imageDescription || "",
            })),
        }
        localStorage.setItem("tempDocumentState", JSON.stringify(documentToSave))
        localStorage.setItem("tempStep", step.toString())
        router.push("/templates/new/confessional")
    }

    // Добавление новой записи
    const addRecord = () => {
        const newRecord: PersonFromConfessionalDocument = currentTemplate
            ? {
                idDate: Date.now(),
                firstName: currentTemplate.firstName || "",
                lastName: currentTemplate.lastName || "",
                middleName: currentTemplate.middleName || "",
                gender: currentTemplate.gender || "MALE",
                birthDate: currentTemplate.birthDate ? {...currentTemplate.birthDate} : null,
                deathDate: currentTemplate.deathDate ? {...currentTemplate.deathDate} : null,
                uyezd: currentTemplate.uyezd ? {...currentTemplate.uyezd} : null,
                volost: currentTemplate.volost ? {...currentTemplate.volost} : null,
                place: currentTemplate.place ? {...currentTemplate.place} : null,
                household: currentTemplate.household || "",
                landowner: currentTemplate.landowner ? {...currentTemplate.landowner} : null,
                familyStatus: currentTemplate.familyStatus ? {...currentTemplate.familyStatus} : null,
                socialStatus: currentTemplate.socialStatus ? {...currentTemplate.socialStatus} : null,
                image: currentTemplate.image || "",
                imageDescription: currentTemplate.imageDescription || "",
            }
            : {
                idDate: Date.now(),
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
                image: "",
                imageDescription: "",
            }
        setDocument((prev) => ({
            ...prev,
            people: [...prev.people, newRecord],
        }))
        toast({
            title: "Запись добавлена",
            description: currentTemplate ? "Запись из шаблона успешно добавлена" : "Новая пустая запись успешно добавлена",
        })
    }

    // Обновленная функция восстановления состояния
    useEffect(() => {
        const tempDocumentState = localStorage.getItem("tempDocumentState")
        const tempStep = localStorage.getItem("tempStep")
        if (tempDocumentState && tempStep) {
            const parsedDocument = JSON.parse(tempDocumentState)
            setDocument(parsedDocument)
            setStep(Number.parseInt(tempStep))
            localStorage.removeItem("tempDocumentState")
            localStorage.removeItem("tempStep")
        }
    }, [])

    const handleParishChange = useCallback(async (field: keyof ConfessionalDocument, value: string) => {
        setDocument((prev) => ({...prev, parish: {id: undefined, parish: value}}));

        if (value.length > 1) {
            try {
                // Выполняем запрос для получения подсказок по полю "parish"
                const response = await autocompleteApi.getParishes(value);
                setParishes((prev) => ({...prev, [field]: response?.data || []}));
            } catch (error) {
                console.error(`Ошибка загрузки ${field}:`, error);
            }
        } else {
            // Если значение меньше 2 символов, очищаем подсказки
            setParishes((prev) => ({...prev, [field]: []}));
        }

    }, []);

    const renderParishInput = (field: "parish") => {
        const value = document[field]?.parish || "";  // Доступ к полю parish объекта document

        return (
            <div className="relative space-y-2">

                <Label htmlFor={field} className="text-base">
                    Приход
                </Label>
                <div className="relative">
                    <Input
                        placeholder="Например: Троицкий приход"
                        value={value}
                        onChange={(e) => handleParishChange(field, e.target.value)} // Обработчик изменения
                        className="pl-10 h-12 text-base"
                    />
                    <Church className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground"/>
                </div>

                {parishes[field]?.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                        {(parishes[field] as { id: number; parish: string }[]).map((suggestion, index) => {
                            return (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDocument((prev) => {
                                            return {...prev, [field]: suggestion}; // Подставляем выбранное значение (id и parish) в document
                                        });
                                        // Скрываем все подсказки после выбора
                                        setParishes({
                                            ...parishes, // Оставляем остальные подсказки
                                            [field]: [],
                                        });
                                    }}
                                >
                                    {suggestion.parish} {/* Отображаем только поле parish */}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Исповедная ведомость
                    </h1>
                    <p className="text-muted-foreground mb-8">Добавьте информацию о документе и связанных с ним
                        людях</p>

                    <div className="mb-8">
                        <div className="flex items-center">
                            {steps.map((s, index) => (
                                <React.Fragment key={s.id}>
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        } transition-colors duration-300`}
                                    >
                                        {React.createElement(s.icon, {className: "h-5 w-5"})}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-primary rounded-full transition-all duration-500 ease-in-out ${
                                                    step > s.id ? "w-full" : "w-0"
                                                }`}
                                            ></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-sm font-medium">
                            {steps.map((s) => (
                                <span key={s.id}
                                      className={step >= s.id ? "text-primary" : "text-muted-foreground"}>
                  {s.title}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl shadow-lg">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={step}
                                custom={direction}
                                initial={{x: direction > 0 ? 300 : -300, opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                exit={{x: direction < 0 ? 300 : -300, opacity: 0}}
                                transition={{
                                    x: {type: "spring", stiffness: 300, damping: 30},
                                    opacity: {duration: 0.2}
                                }}
                            >
                                <Card className="border-none shadow-none">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-2xl flex items-center gap-2">
                                            {steps[step - 1].icon &&
                                                React.createElement(steps[step - 1].icon, {className: "h-6 w-6 text-primary"})}
                                            {steps[step - 1].title}
                                        </CardTitle>
                                        <CardDescription>
                                            {step === 1 && "Введите основные данные о добавляемом документе"}
                                            {step === 2 && "Добавьте людей, упомянутых в документе"}
                                            {step === 3 && "Проверьте введенные данные перед сохранением"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {step === 1 && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="title" className="text-base">
                                                        Название документа
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="title"
                                                            name="title"
                                                            placeholder="Например: Исповедная ведомость Вологодской епархии"
                                                            value={document.title}
                                                            onChange={handleInputChange}
                                                            className="pl-10 h-12 text-base"
                                                        />
                                                        <FileText
                                                            className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground"/>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="createdAt" className="text-base">
                                                        Год создания
                                                    </Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="createdAt"
                                                            name="createdAt"
                                                            type="number"
                                                            placeholder="Например: 1821"
                                                            value={document.createdAt}
                                                            onChange={handleYearChange}
                                                            min="0"
                                                            max={new Date().getFullYear()}
                                                            className="pl-10 h-12 text-base"
                                                        />
                                                        <Calendar
                                                            className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground"/>
                                                    </div>
                                                </div>

                                                {renderParishInput("parish")}

                                            </>
                                        )}
                                        {step === 2 && (
                                            <>
                                                {/* Выбор шаблона */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="template" className="text-base">
                                                        Выберите шаблон
                                                    </Label>
                                                    <Select value={selectedTemplateId || ""}
                                                            onValueChange={handleTemplateSelect}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Выберите шаблон"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {templates.map((template) => (
                                                                <SelectItem key={template.id}
                                                                            value={template.id}>
                                                                    {template.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {/* Отображение выбранного шаблона */}
                                                {currentTemplate && (
                                                    <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="font-medium">Текущий
                                                                шаблон: {currentTemplate.name}</h3>
                                                            <Button variant="ghost" size="sm"
                                                                    onClick={cancelTemplateSelection}>
                                                                <X className="h-4 w-4 mr-2"/>
                                                                Отменить выбор
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {currentTemplate.lastName} {currentTemplate.firstName} {currentTemplate.middleName}
                                                        </p>
                                                    </div>
                                                )}
                                                {/* Список записей */}
                                                <ScrollArea className="h-[50vh] pr-4">
                                                    {document.people.map((record, index) => (
                                                        <RecordForm
                                                            key={record.id}
                                                            record={record}
                                                            index={index}
                                                            onRecordChange={handleRecordChange}
                                                            onRemoveRecord={removeRecord}
                                                        />
                                                    ))}
                                                </ScrollArea>
                                                {/* Кнопки добавления записи и создания шаблона */}
                                                <div className="flex gap-4 mt-4">
                                                    <Button onClick={addRecord}
                                                            className="flex-1 h-12 text-base">
                                                        <Plus className="mr-2 h-4 w-4"/> Добавить запись
                                                    </Button>
                                                    <Button variant="outline" onClick={addNewTemplate}
                                                            className="flex-1 h-12 text-base">
                                                        <Save className="mr-2 h-4 w-4"/> Создать шаблон
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        {step === 3 && (
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">
                                                        Основная информация
                                                    </h3>
                                                    <div className="space-y-1">
                                                        <p>
                                                            <strong>Название:</strong> {document.title}
                                                        </p>
                                                        <p>
                                                            <strong>Год создания:</strong> {document.createdAt}
                                                        </p>
                                                        <p>
                                                            <strong>Приход:</strong> {document.parish?.parish || "Не выбран"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2">
                                                        Записи документа ({document.people?.length})
                                                    </h3>
                                                    <ScrollArea className="h-[30vh] pr-4">
                                                        {document.people.map((record, index) => (
                                                            <div key={record.id}
                                                                 className="mb-4 p-4 border rounded-lg">
                                                                <h4 className="font-medium">
                                                                    {index + 1}. {record.lastName} {record.firstName} {record.middleName}
                                                                </h4>
                                                                <p>Пол: {record.gender === "MALE" ? "Мужской" : "Женский"}</p>
                                                                <p>
                                                                    Дата рождения:{" "}
                                                                    {record.birthDate
                                                                        ? `${record.birthDate.description}-${record.birthDate.exactDate}`
                                                                        : "Не указана"}
                                                                </p>
                                                                <p>Место рождения: {record.place?.place || "Не указано"}</p>
                                                                <p>Двор: {record.household || "Не указан"}</p>
                                                                <p>Землевладелец: {record.landowner?.landowner || "Не указан"}</p>
                                                                <p>Семейный статус: {record.familyStatus?.familyStatus || "Не указан"}</p>
                                                                <p>Социальный статус: {record.socialStatus?.socialStatus || "Не указан"}</p>
                                                                {record.image && (
                                                                    <div>
                                                                        <p>
                                                                            <strong>Изображение:</strong> {record.image}
                                                                        </p>
                                                                        <p>
                                                                            <strong>Описание
                                                                                изображения:</strong> {record.imageDescription}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                        )}
                                        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                                    </CardContent>
                                    <CardFooter className="flex justify-between pt-2">
                                        {step > 1 && (
                                            <Button
                                                variant="outline"
                                                onClick={prevStep}
                                                size="lg"
                                                className="gap-2 text-base group relative overflow-hidden"
                                            >
                                                <ChevronLeft
                                                    className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform"/>
                                                <span className="relative z-10">Назад</span>
                                                <div
                                                    className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            </Button>
                                        )}
                                        {step < steps.length ? (
                                            <Button
                                                onClick={nextStep}
                                                size="lg"
                                                className={`gap-2 text-base group relative overflow-hidden ${step === 1 ? "ml-auto" : ""}`}
                                            >
                                                <span className="relative z-10">Далее</span>
                                                <ChevronRight
                                                    className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform"/>
                                                <div
                                                    className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleSubmit}
                                                size="lg"
                                                className="gap-2 text-base group relative overflow-hidden"
                                            >
                                                <span className="relative z-10">Сохранить</span>
                                                <Save
                                                    className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform"/>
                                                <div
                                                    className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    )
}
