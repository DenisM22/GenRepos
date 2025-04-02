"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Baby, Calendar, Edit, Heart, MapPin, PersonStanding, Trash2, User, UserCircle2, Users} from "lucide-react"
import {Button} from "@/components/ui/button"
import type {Person} from "@/app/types/models"
import {personApi} from "@/app/api/api";
import {AxiosError} from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {toast} from "@/components/ui/use-toast"

export default function PersonPage() {
    const params = useParams()
    const router = useRouter()
    const [person, setPerson] = useState<Person | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchPerson = async () => {
        try {
            const response = await personApi.getById(params.id)
            setPerson(response.data)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                toast({
                    title: "Ошибка при загрузке человека",
                    description: `${error.response?.data?.message || error.message}`,
                    variant: "destructive",
                })
            } else {
                console.error(error);
                toast({
                    title: "Неизвестная ошибка",
                    variant: "destructive",
                })
            }
        }
    };

    useEffect(() => {
        fetchPerson()
    }, [params.id])

    const handleDelete = async () => {
        if (!person) return

        setIsDeleting(true)

        try {
            await personApi.delete(params.id)

            console.log("Человек удален");
            toast({
                title: "Человек удален",
                description: `${person.lastName} ${person.firstName} ${person.middleName} был удален из базы данных`,
                variant: "info",
            })

            router.push("/people")
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Ошибка при удалении человека:", error.response);
                toast({
                    title: "Ошибка при удалении человека",
                    description: `${error?.response?.data}`,
                    variant: "destructive",
                })
            } else {
                console.error("Неизвестная ошибка:", error);
                toast({
                    title: "Неизвестная ошибка",
                    variant: "destructive",
                })
            }
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    if (!person) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <Card className="mb-8">

                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <User className="h-8 w-8 text-primary"/>
                            {person.lastName} {person.firstName} {person.middleName}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialogOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4"/>
                                Удалить
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/people/${params.id}/edit`)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4"/>
                                Редактировать
                            </Button>

                        </div>
                    </CardHeader>


                    <CardContent className="space-y-3">
                        {/* Пол */}
                        <div className="flex items-center gap-2">
                            <UserCircle2 className="h-5 w-5 text-muted-foreground"/>
                            <span>
            <strong>Пол:</strong> {person.gender === "MALE" ? "Мужской" : "Женский"}
        </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Дата рождения */}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-muted-foreground"/>
                                <span>
            <strong>Дата рождения:</strong>{" "}
                                    {person.birthDate ? (
                                        person.birthDate.description === "Диапазон" ? (
                                            `между ${person.birthDate.startDate} и ${person.birthDate.endDate}`
                                        ) : person.birthDate.description === "Точная дата" ? (
                                            person.birthDate.exactDate
                                        ) : (
                                            person.birthDate.description?.toLowerCase() + " " + person.birthDate.exactDate
                                        )
                                    ) : (
                                        "Не указана"
                                    )}
        </span>
                            </div>

                            {/* Дата смерти (отступ вместо иконки) */}
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5"></div>
                                {/* Пустой блок для отступа */}
                                <span>
            <strong>Дата смерти:</strong>{" "}
                                    {person.deathDate ? (
                                        person.deathDate.description === "Диапазон" ? (
                                            `между ${person.deathDate.startDate} и ${person.deathDate.endDate}`
                                        ) : person.deathDate.description === "Точная дата" ? (
                                            person.deathDate.exactDate
                                        ) : (
                                            person.deathDate.description?.toLowerCase() + " " + person.deathDate.exactDate
                                        )
                                    ) : (
                                        "Не указана"
                                    )}
        </span>
                            </div>
                        </div>

                        {/* Место рождения */}
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground"/>
                            <span>
            <strong>Место рождения:</strong>{" "}
                                {person.place
                                    ? `${person.place?.volost?.uyezd?.uyezd || "—"} уезд, ${person.place?.volost?.volost || "—"}, ${person.place?.place || "—"}`
                                    : "не указано"}
        </span>
                        </div>

                        {/* Социальный статус */}
                        <div className="flex items-center gap-2">
                            <PersonStanding className="h-5 w-5 text-muted-foreground"/>
                            <span>
                <strong>Социальный статус:</strong> {person?.socialStatus?.socialStatus || "не указан"}
            </span>
                        </div>

                    </CardContent>


                </Card>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary"/>
                        Ближайшие родственники
                    </h2>

                    <Card>
                        <CardContent className="p-6">
                            <FamilyTree person={person}/>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center">
                    <Button onClick={() => router.push(`/family-tree/${params.id}`)} className="gap-2">
                        <Users className="h-4 w-4"/>
                        Полное семейное древо
                    </Button>
                </div>

            </main>

            {/* Диалог подтверждения удаления */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Удаление человека</DialogTitle>
                        <DialogDescription>
                            Вы уверены, что хотите удалить {person.lastName} {person.firstName} {person.middleName} из
                            базы данных?
                            Это действие нельзя будет отменить.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Отмена
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Удаление..." : "Удалить"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

interface FamilyTreeProps {
    person: Person
}

const FamilyTree: React.FC<FamilyTreeProps> = ({person}) => {
    // Определяем, сколько у нас родственников и какой размер нужен для дерева
    const hasParents = person.father || person.mother
    const hasSpouse = !!person.spouse
    const childrenCount = person.children?.length || 0

    // Рассчитываем размеры дерева
    const treeHeight = 500
    const minWidth = Math.max(
        hasParents ? 400 : 200,
        hasSpouse ? 400 : 200,
        childrenCount > 0 ? childrenCount * 180 : 200,
    )

    return (
        <div className="w-full overflow-auto">
            <div className="relative mx-auto" style={{height: `${treeHeight}px`, minWidth: `${minWidth}px`}}>
                {/* Центральная персона */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <PersonNode person={person} type="self" className="bg-primary/10 border-primary"/>
                </div>

                {/* Родители */}
                {hasParents && (
                    <>
                        {/* Линия вверх к родителям */}
                        <div
                            className="absolute left-1/2 top-[calc(50%-45px)] w-0.5 h-[35px] bg-gray-300 transform -translate-x-1/2 -translate-y-full"></div>

                        {/* Горизонтальная линия между родителями */}
                        {person.father && (
                            <div
                                className="absolute left-1/2 top-[calc(50%-80px)] w-[242px] h-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                        )}

                        {/* Отец */}
                        {person.father && (
                            <>
                                <div
                                    className="absolute left-[calc(50%-120px)] top-[calc(50%-160px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"></div>
                                <div
                                    className="absolute left-[calc(50%-120px)] top-[calc(50%-190px)] transform -translate-x-1/2">
                                    <PersonNode person={person.father} type="father"
                                                href={`/people/${person.father.id}`}/>
                                </div>
                            </>
                        )}

                        {person.mother ? (
                            <>
                                {/* Если есть только мать, центрируем её */}
                                <div
                                    className="absolute top-[calc(50%-160px)] w-0.5 h-[81px] bg-gray-300 transform -translate-x-1/2"
                                    style={{
                                        left: person.father ? "calc(50% + 120px)" : "50%",
                                    }}
                                ></div>
                                <div
                                    className="absolute top-[calc(50%-190px)] transform -translate-x-1/2"
                                    style={{
                                        left: person.father ? "calc(50% + 120px)" : "50%",
                                    }}
                                >
                                    <PersonNode person={person.mother} type="mother"
                                                href={`/people/${person.mother.id}`}/>
                                </div>
                            </>
                        ) : person.father ? (
                            <>
                                {/* Если матери нет, но есть отец — отображаем Placeholder */}
                                <div
                                    className="absolute left-[calc(50%+120px)] top-[calc(50%-160px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"></div>
                                <div
                                    className="absolute left-[calc(50%+120px)] top-[calc(50%-190px)] transform -translate-x-1/2">
                                    <div
                                        className="w-[160px] p-3 rounded-lg border bg-card hover:bg-card/80 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">?
                                            </div>
                                            <span className="text-xs font-medium">Мать</span>
                                        </div>
                                        <div className="text-sm font-medium">Неизвестно</div>
                                        <div>-</div>
                                    </div>
                                </div>
                            </>
                        ) : null}

                    </>
                )}

                {/* Супруг(а) */}
                {hasSpouse && (
                    <>
                        {/* Горизонтальная линия к супругу */}
                        <div
                            className="absolute left-[calc(50%+80px)] top-1/2 w-[100px] h-0.5 bg-gray-300 transform -translate-y-1/2"></div>

                        <div
                            className="absolute left-[calc(50%+220px)] top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <PersonNode person={person.spouse!} type="spouse" href={`/people/${person.spouse!.id}`}/>
                        </div>
                    </>
                )}

                {/* Дети */}
                {childrenCount > 0 && (
                    <>
                        {/* Линия вниз к детям */}
                        <div
                            className="absolute left-1/2 top-1/2 w-0.5 h-[90px] bg-gray-300 transform -translate-x-1/2 translate-y-1/2"></div>

                        {/* Горизонтальная линия между детьми */}
                        {childrenCount > 1 && (
                            <div
                                className="absolute left-1/2 top-[calc(50%+80px)] bg-gray-300 transform -translate-x-1/2"
                                style={{
                                    width: `${(childrenCount - 1) * 180}px`,
                                    height: "2px",
                                }}
                            ></div>
                        )}

                        {/* Отображение детей */}
                        {person.children?.map((child, index) => {
                            const totalWidth = (childrenCount - 1) * 180
                            const startX = -totalWidth / 2
                            const childX = startX + index * 180

                            return (
                                <div key={child.id}>
                                    {/* Вертикальная линия к ребенку */}
                                    <div
                                        className="absolute top-[calc(50%+80px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"
                                        style={{left: `calc(50% + ${childX}px)`}}
                                    ></div>

                                    {/* Ребенок */}
                                    <div
                                        className="absolute transform -translate-x-1/2"
                                        style={{
                                            left: `calc(50% + ${childX}px)`,
                                            top: "calc(50% + 160px)",
                                        }}
                                    >
                                        <PersonNode person={child} type="child" href={`/people/${child.id}`}/>
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
        </div>
    )
}

interface PersonNodeProps {
    person: Partial<Person>
    type: "self" | "father" | "mother" | "spouse" | "child"
    href?: string
    className?: string
}

const PersonNode: React.FC<PersonNodeProps> = ({person, type, href, className = ""}) => {
    const getIcon = () => {
        switch (type) {
            case "father":
                return <User className="h-4 w-4"/>
            case "mother":
                return <User className="h-4 w-4"/>
            case "spouse":
                return <Heart className="h-4 w-4"/>
            case "child":
                return <Baby className="h-4 w-4"/>
            default:
                return <User className="h-4 w-4"/>
        }
    }

    const getRelationLabel = () => {
        switch (type) {
            case "father":
                return "Отец"
            case "mother":
                return "Мать"
            case "spouse":
                return person.gender === "MALE" ? "Муж" : "Жена"
            case "child":
                return person.gender === "MALE" ? "Сын" : "Дочь"
            default:
                return ""
        }
    }

    const content = (
        <div className={`w-[160px] p-3 rounded-lg border ${className || "bg-card hover:bg-card/80"} transition-colors`}>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">{getIcon()}</div>
                {type !== "self" && <span className="text-xs font-medium">{getRelationLabel()}</span>}
            </div>
            <div className="text-sm font-medium">
                {person.lastName} {person.firstName}
            </div>
            <div className="text-[12px] text-muted-foregroun">
                {person.birthDate ? (
                    person.birthDate.description === "Диапазон" ? (
                        `между ${person.birthDate.startDate?.slice(0, 4)} и ${person.birthDate.endDate?.slice(0, 4)}`
                    ) : person.birthDate.description === "Точная дата" ? (
                        person.birthDate.exactDate?.slice(0, 4)
                    ) : (
                        person.birthDate.description?.toLowerCase() + " " + person.birthDate.exactDate?.slice(0, 4)
                    )
                ) : (
                    "-"
                )}
            </div>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}
