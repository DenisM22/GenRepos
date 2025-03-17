"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Calendar, MapPin, Church, Baby, Heart, Skull } from "lucide-react"
import type { MetricDocument, BirthRecord, MarriageRecord, DeathRecord } from "@/app/types/models"
import {confessionalDocumentApi, metricDocumentApi} from "@/app/api/api";
import {AxiosError} from "axios";

export default function MetricDocumentPage() {
    const params = useParams()
    const [message, setMessage] = useState('')
    const [document, setDocument] = useState<MetricDocument | null>(null)
    const [activeTab, setActiveTab] = useState("birth")

    const fetchDocument = async () => {
        try {
            const response = await metricDocumentApi.getById(params.id)
            setDocument(response.data)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                setMessage('Ошибка при загрузке документа: ' + (error.response?.data?.message || error.message));
            } else {
                console.error(error);
                setMessage('Неизвестная ошибка');
            }
        }
    }

    useEffect(() => {
        fetchDocument()
    }, [params.id])

    if (!document) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <FileText className="h-8 w-8 text-primary" />
                            {document.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span>
                <strong>Год создания:</strong> {document.createdAt}
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Church className="h-5 w-5 text-muted-foreground" />
                            <span>
                <strong>Приход:</strong> {document.parish?.parish}
              </span>
                        </div>
                    </CardContent>
                </Card>

                {message && <p className="mt-4 text-center text-red-500">{message}</p>}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="birth" className="flex items-center gap-2">
                            <Baby className="h-4 w-4" />
                            <span>Рождения ({document.birthRecords?.length || 0})</span>
                        </TabsTrigger>
                        <TabsTrigger value="marriage" className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>Браки ({document.marriageRecords?.length || 0})</span>
                        </TabsTrigger>
                        <TabsTrigger value="death" className="flex items-center gap-2">
                            <Skull className="h-4 w-4" />
                            <span>Смерти ({document.deathRecords?.length || 0})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="birth">
                        <h2 className="text-2xl font-bold mb-4">Записи о рождении</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {document.birthRecords?.map((record, index) => (
                                <BirthRecordCard key={record.id} record={record} index={index} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="marriage">
                        <h2 className="text-2xl font-bold mb-4">Записи о браке</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {document.marriageRecords?.map((record, index) => (
                                <MarriageRecordCard key={record.id} record={record} index={index} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="death">
                        <h2 className="text-2xl font-bold mb-4">Записи о смерти</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {document.deathRecords?.map((record, index) => (
                                <DeathRecordCard key={record.id} record={record} index={index} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

interface BirthRecordCardProps {
    record: BirthRecord
    index: number
}

const BirthRecordCard: React.FC<BirthRecordCardProps> = ({ record, index }) => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
            {index + 1}
          </span>
                    <Baby className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">{record.newbornName}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
                <p>
                    <strong>
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
                    </strong>
                </p>
                <p>
                    <strong>Отец:</strong> {record.fatherLastName} {record.fatherFirstName} {record.fatherMiddleName}
                </p>
                <p>
                    <strong>Мать:</strong> {record.motherFirstName} {record.motherMiddleName}
                </p>
                {record.godparentFirstName && (
                    <p>
                        <strong>Восприемник:</strong> {record.godparentLastName} {record.godparentFirstName}
                    </p>
                )}
                {record.place && (
                    <p>
                        <strong>Место:</strong> {record.place.place}
                    </p>
                )}
                {record.image && (
                    <div className="mt-2">
                        <img
                            src={record.image || "/placeholder.svg"}
                            alt={record.imageDescription || "Изображение записи о рождении"}
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface MarriageRecordCardProps {
    record: MarriageRecord
    index: number
}

const MarriageRecordCard: React.FC<MarriageRecordCardProps> = ({record, index}) => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
            {index + 1}
          </span>
                    <Heart className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">
            {record.groomLastName} и {record.brideLastName}
          </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
                <p>
                    <strong>
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
                    </strong>
                </p>
                <p>
                    <strong>Жених:</strong> {record.groomLastName} {record.groomFirstName} {record.groomMiddleName},{" "}
                    {record.groomAge} лет
                </p>
                <p>
                    <strong>Невеста:</strong> {record.brideLastName} {record.brideFirstName} {record.brideMiddleName},{" "}
                    {record.brideAge} лет
                </p>
                {record.guarantorLastName && (
                    <p>
                        <strong>Поручитель:</strong> {record.guarantorLastName} {record.guarantorFirstName}
                    </p>
                )}
                {record.image && (
                    <div className="mt-2">
                        <img
                            src={record.image || "/placeholder.svg"}
                            alt={record.imageDescription || "Изображение записи о браке"}
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface DeathRecordCardProps {
    record: DeathRecord
    index: number
}

const DeathRecordCard: React.FC<DeathRecordCardProps> = ({record, index}) => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
            {index + 1}
          </span>
                    <Skull className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">
            {record.lastName} {record.firstName} {record.middleName}
          </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
                <p>
                    <strong>Возраст:</strong> {record.age} лет
                </p>
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
                <p>
                    <strong>Причина смерти:</strong> {record.deathCause || "Не указана"}
                </p>
                {record.burialPlace && (
                    <p>
                        <strong>Место погребения:</strong> {record.burialPlace.place}
                    </p>
                )}
                {record.image && (
                    <div className="mt-2">
                        <img
                            src={record.image || "/placeholder.svg"}
                            alt={record.imageDescription || "Изображение записи о смерти"}
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
