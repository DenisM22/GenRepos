"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, MapPin, Church, User, ImageIcon } from "lucide-react"
import type {ConfessionalDocument, PersonFromConfessionalDocument, PersonFromRevisionDocument} from "@/app/types/models"
import Image from "next/image"
import {confessionalDocumentApi, revisionDocumentApi} from "@/app/api/api";
import {AxiosError} from "axios";

export default function DocumentPage() {
  const params = useParams()
  const [message, setMessage] = useState('')
  const [document, setDocument] = useState<ConfessionalDocument | null>(null)

  const fetchDocument = async () => {
    try {
      const response = await revisionDocumentApi.getById(params.id)
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
  };
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
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                <strong>Место:</strong> {document.parish?.parish}
              </span>
              </div>
            </CardContent>
          </Card>

          {message && <p className="mt-4 text-center text-red-500">{message}</p>}

          <h2 className="text-2xl font-bold mb-4">Записи документа</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {document.people?.map((person, index) => (
                <PersonCard key={person.id} person={person} index={index} />
            ))}
          </div>
        </main>
      </div>
  )
}

const PersonCard: React.FC<{ person: PersonFromRevisionDocument; index: number }> = ({ person, index }) => {
  return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
            {index + 1}
          </span>
            <User className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">
            {person.lastName} {person.firstName} {person.middleName}
          </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1.5">
          <p>
            <strong>Пол:</strong> {person.gender === "MALE" ? "Мужской" : "Женский"}
          </p>
          {person.household && (
              <p>
                <strong>Домохозяйство:</strong> {person.household}
              </p>
          )}
          {person.landowner && (
              <p>
                <strong>Землевладелец:</strong> {person.landowner?.landowner}
              </p>
          )}
          {person.familyStatus && (
              <p>
                <strong>Семейное положение:</strong> {person.familyStatus?.familyStatus}
              </p>
          )}
          {person.socialStatus && (
              <p>
                <strong>Социальный статус:</strong> {person.socialStatus?.socialStatus}
              </p>
          )}
          {person.image && (
              <div className="mt-2">
                <p className="flex items-center gap-1 mb-1">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  <strong>Изображение</strong>
                </p>
                <Image
                    src={person.image || "/placeholder.svg"}
                    alt={person.imageDescription || "Изображение"}
                    width={100}
                    height={100}
                    className="rounded-md"
                />
              </div>
          )}
        </CardContent>
      </Card>
  )
}
