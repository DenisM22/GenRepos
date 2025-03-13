"use client"

import React, {useCallback, useState} from "react"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion} from "framer-motion"
import {
    Baby,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Church,
    FileText,
    Heart,
    Plus,
    Save,
    Skull,
} from "lucide-react"
import Header from "@/components/header"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {BirthRecord, DeathRecord, FuzzyDate, MarriageRecord, MetricDocument, Parish,} from "@/app/types/models"
import {BirthRecordForm} from "@/components/BirthRecordForm"
import {MarriageRecordForm} from "@/components/MarriageRecordForm"
import {autocompleteApi, metricDocumentApi} from "@/app/api/api";
import {DeathRecordForm} from "@/components/DeathRecordForm";

// Шаги процесса добавления документа
const steps = [
    {id: 1, title: "Основная информация", icon: FileText},
    {id: 2, title: "Записи рождения", icon: Baby},
    {id: 3, title: "Записи брака", icon: Heart},
    {id: 4, title: "Записи смерти", icon: Skull},
    {id: 5, title: "Подтверждение", icon: Check},
]

export default function AddDocument() {
    const router = useRouter()
    const [message, setMessage] = useState('')

    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)

    const [document, setDocument] = useState<MetricDocument>({
        birthRecords: [],
        marriageRecords: [],
        deathRecords: [],
    })
    const [parishes, setParishes] = useState<Parish[]>([])

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

    //Добавление записей
    const addBirthRecord = () => {
        const newRecord: BirthRecord = {
            idDate: Date.now(),
        };
        setDocument((prev) => ({
            ...prev,
            birthRecords: [...prev.birthRecords, newRecord],
        }));
    };
    const addMarriageRecord = () => {
        const newRecord: MarriageRecord = {
            idDate: Date.now(),
        };
        setDocument((prev) => ({
            ...prev,
            marriageRecords: [...prev.marriageRecords, newRecord],
        }));
    };
    const addDeathRecord = () => {
        const newRecord: DeathRecord = {
            idDate: Date.now(),
        };
        setDocument((prev) => ({
            ...prev,
            deathRecords: [...prev.deathRecords, newRecord],
        }));
    };

    //Изменение записей
    const handleBirthRecordChange = useCallback((idDate: number, field: string, value: any, key?: keyof FuzzyDate) => {
        setDocument((prev) => ({
            ...prev,
            birthRecords: prev.birthRecords.map((record) =>
                record.idDate === idDate
                    ? {
                        ...record,
                        [field]: key
                            ? {...record[field], [key]: value}
                            : value,
                    }
                    : record
            ),
        }));
    }, []);
    const handleMarriageRecordChange = useCallback((idDate: number, field: string, value: any, key?: keyof FuzzyDate) => {
        setDocument((prev) => ({
            ...prev,
            marriageRecords: prev.marriageRecords.map((record) =>
                record.idDate === idDate
                    ? {
                        ...record,
                        [field]: key
                            ? {...record[field], [key]: value}
                            : value,
                    }
                    : record
            ),
        }));
    }, []);
    const handleDeathRecordChange = useCallback((idDate: number, field: string, value: any, key?: keyof FuzzyDate) => {
        setDocument((prev) => ({
            ...prev,
            deathRecords: prev.deathRecords.map((record) =>
                record.idDate === idDate
                    ? {
                        ...record,
                        [field]: key
                            ? {...record[field], [key]: value}
                            : value,
                    }
                    : record
            ),
        }));
    }, []);

    //Удаление записей
    const removeBirthRecord = useCallback((idDate: number) => {
        setDocument((prev) => ({
            ...prev,
            birthRecords: prev.birthRecords.filter((record) => record.idDate !== idDate),
        }));
    }, []);
    const removeMarriageRecord = useCallback((idDate: number) => {
        setDocument((prev) => ({
            ...prev,
            marriageRecords: prev.marriageRecords.filter((record) => record.idDate !== idDate),
        }));
    }, []);
    const removeDeathRecord = useCallback((idDate: number) => {
        setDocument((prev) => ({
            ...prev,
            deathRecords: prev.deathRecords.filter((record) => record.idDate !== idDate),
        }));
    }, []);

    // Переход к следующему шагу
    const nextStep = () => {
        if (step == 1 && validateDocument()) {
            setMessage(validateDocument())
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return
        }

        if (step == 2 && (validateBirthRecords())) {
            setMessage(validateBirthRecords())
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return
        }

        if (step == 3 && validateMarriageRecords()) {
            setMessage(validateMarriageRecords)
            setTimeout(() => {
                setMessage("");
            }, 3000);
            return
        }

        if (step == 4 && validateDeathRecords()) {
            setMessage(validateDeathRecords)
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

    //Валидация
    const validateDocument = (): string | null => {
        if (!document.title?.trim()) {
            return `Укажите название документа`
        }
        return null;
    };
    const validateBirthRecords = (): string | null => {
        for (const record of document.birthRecords) {
            if (!record.newbornName?.trim()) {
                return "Укажите имя новорожденного для каждой записи"
            }
        }
        return null;
    };
    const validateMarriageRecords = (): string | null => {
        for (const record of document.marriageRecords) {
            if (!record.groomFirstName?.trim() || !record.groomLastName?.trim()) {
                return "Укажите имя и фамилию жениха для каждой записи"
            }
            if (!record.brideFirstName?.trim() || !record.brideLastName?.trim()) {
                return "Укажите имя и фамилию невесты для каждой записи"
            }
        }
        return null;
    };
    const validateDeathRecords = (): string | null => {
        for (const record of document.deathRecords) {
            if (!record.firstName?.trim() || !record.lastName?.trim()) {
                return "Укажите имя и фамилию для каждой записи"
            }
        }
        return null;
    };

    //Отправка формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await metricDocumentApi.save(document)
            console.log("Документ успешно сохранен")
            router.push("/documents/new")
        } catch (error) {
            console.error("Ошибка при сохранении документа:", error);
            setMessage("Ошибка при сохранении документа:" + error)
        }
    }

    const handleParishChange = useCallback(async (field: keyof MetricDocument, value: string) => {
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
                        placeholder="Например: Успенский приход"
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
                        Метрическая книга
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
                                            {step === 2 && "Добавьте записи о рождении"}
                                            {step === 3 && "Добавьте записи о браке"}
                                            {step === 4 && "Добавьте записи о смерти"}
                                            {step === 5 && "Проверьте введенные данные перед сохранением"}
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
                                                            placeholder="Например: Метрическая книга Вологодской духовной Консистории"
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
                                                            placeholder="Например: 1849"
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
                                                {/* Список записей */}
                                                <ScrollArea className="h-[50vh] pr-4">
                                                    {document.birthRecords.map((record, index) => (
                                                        <BirthRecordForm
                                                            key={record.idDate}
                                                            record={record}
                                                            index={index}
                                                            onRecordChange={handleBirthRecordChange}
                                                            onRemoveRecord={removeBirthRecord}
                                                        />
                                                    ))}
                                                </ScrollArea>
                                                {/* Кнопки добавления записи и создания шаблона */}
                                                <div className="flex gap-4 mt-4">
                                                    <Button onClick={addBirthRecord}
                                                            className="flex-1 h-12 text-base">
                                                        <Plus className="mr-2 h-4 w-4"/> Добавить запись
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {step === 3 && (
                                            <>
                                                {/* Список записей */}
                                                <ScrollArea className="h-[50vh] pr-4">
                                                    {document.marriageRecords.map((record, index) => (
                                                        <MarriageRecordForm
                                                            key={record.idDate}
                                                            record={record}
                                                            index={index}
                                                            onRecordChange={handleMarriageRecordChange}
                                                            onRemoveRecord={removeMarriageRecord}
                                                        />
                                                    ))}
                                                </ScrollArea>
                                                {/* Кнопки добавления записи и создания шаблона */}
                                                <div className="flex gap-4 mt-4">
                                                    <Button onClick={addMarriageRecord}
                                                            className="flex-1 h-12 text-base">
                                                        <Plus className="mr-2 h-4 w-4"/> Добавить запись
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {step === 4 && (
                                            <>
                                                {/* Список записей */}
                                                <ScrollArea className="h-[50vh] pr-4">
                                                    {document.deathRecords.map((record, index) => (
                                                        <DeathRecordForm
                                                            key={record.idDate}
                                                            record={record}
                                                            index={index}
                                                            onRecordChange={handleDeathRecordChange}
                                                            onRemoveRecord={removeDeathRecord}
                                                        />
                                                    ))}
                                                </ScrollArea>
                                                {/* Кнопки добавления записи и создания шаблона */}
                                                <div className="flex gap-4 mt-4">
                                                    <Button onClick={addDeathRecord}
                                                            className="flex-1 h-12 text-base">
                                                        <Plus className="mr-2 h-4 w-4"/> Добавить запись
                                                    </Button>
                                                </div>
                                            </>
                                        )}

                                        {step === 5 && (
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
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-2">
                                                            Записи о рождении ({document.birthRecords.length})
                                                        </h3>
                                                        <ScrollArea className="h-[20vh] pr-4">
                                                            {document.birthRecords.map((record, index) => (
                                                                <div key={record.idDate}
                                                                     className="mb-4 p-4 border rounded-lg">
                                                                    <h4 className="font-medium">
                                                                        {index + 1}. {record.newbornName || "Без имени"}
                                                                    </h4>
                                                                    <p>
                                                                        Родители: {record.fatherLastName} {record.fatherFirstName} {record.fatherMiddleName} и{" "}
                                                                        {record.motherFirstName} {record.motherMiddleName}
                                                                    </p>
                                                                    <p>
                                                                        Дата рождения:{" "}
                                                                        {record.birthDate ? (
                                                                            record.birthDate.description === "Диапазон" ? (
                                                                                `между ${record.birthDate.startDate} и ${record.birthDate.endDate}`
                                                                            ) : (
                                                                                record.birthDate.description.toLowerCase() + " " + record.birthDate.exactDate
                                                                            )
                                                                        ) : (
                                                                            "Не указана"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </ScrollArea>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-2">
                                                            Записи о браке ({document.marriageRecords.length})
                                                        </h3>
                                                        <ScrollArea className="h-[20vh] pr-4">
                                                            {document.marriageRecords.map((record, index) => (
                                                                <div key={record.idDate}
                                                                     className="mb-4 p-4 border rounded-lg">
                                                                <h4 className="font-medium">
                                                                        {index + 1}.
                                                                        Брак: {record.groomLastName} {record.groomFirstName} и{" "}
                                                                        {record.brideLastName} {record.brideFirstName}
                                                                    </h4>
                                                                    <p>
                                                                        Дата брака:{" "}
                                                                        {record.marriageDate ? (
                                                                            record.marriageDate.description === "Диапазон" ? (
                                                                                `между ${record.marriageDate.startDate} и ${record.marriageDate.endDate}`
                                                                            ) : (
                                                                                record.marriageDate.description.toLowerCase() + " " + record.marriageDate.exactDate
                                                                            )
                                                                        ) : (
                                                                            "Не указана"
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </ScrollArea>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-2">
                                                        Записи о смерти ({document.deathRecords.length})
                                                        </h3>
                                                        <ScrollArea className="h-[20vh] pr-4">
                                                            {document.deathRecords.map((record, index) => (
                                                                <div key={record.idDate}
                                                                     className="mb-4 p-4 border rounded-lg">
                                                                    <h4 className="font-medium">
                                                                        {index + 1}. {record.lastName} {record.firstName} {record.middleName}
                                                                    </h4>
                                                                    <p>Возраст: {record.age || "Не указан"}</p>
                                                                    <p>
                                                                        Дата смерти:{" "}
                                                                        {record.deathDate ? (
                                                                            record.deathDate.description === "Диапазон" ? (
                                                                                `между ${record.deathDate.startDate} и ${record.deathDate.endDate}`
                                                                            ) : (
                                                                                record.deathDate.description.toLowerCase() + " " + record.deathDate.exactDate
                                                                            )
                                                                        ) : (
                                                                            "Не указана"
                                                                        )}
                                                                    </p>
                                                                    <p>Причина
                                                                        смерти: {record.deathCause || "Не указана"}</p>
                                                                </div>
                                                            ))}
                                                        </ScrollArea>
                                                    </div>
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
