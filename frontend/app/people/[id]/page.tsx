"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, MapPin, FileText } from "lucide-react"

interface Document {
  id: string
  title: string
  year: string
}

interface Person {
  id: string
  name: string
  birthYear: string
  birthPlace: string
  documents: Document[]
}

export default function PersonPage() {
  const params = useParams()
  const [person, setPerson] = useState<Person | null>(null)

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем моковые данные
    const mockPerson: Person = {
      id: params.id as string,
      name: "Иванов Иван Иванович",
      birthYear: "1985",
      birthPlace: "Москва, Россия",
      documents: [
        { id: "1", title: "Свидетельство о рождении", year: "1985" },
        { id: "2", title: "Паспорт", year: "2000" },
        { id: "3", title: "Свидетельство о браке", year: "2010" },
      ],
    }
    setPerson(mockPerson)
  }, [params.id])

  if (!person) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              {person.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Год рождения: {person.birthYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Место рождения: {person.birthPlace}</span>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Связанные документы</h2>
        <div className="grid gap-4">
          {person.documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {doc.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Год:</strong> {doc.year}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

