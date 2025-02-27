"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, MapPin } from "lucide-react"

interface Record {
  id: string
  number: number
  name: string
  relation: string
  details: string
}

interface Document {
  id: string
  title: string
  year: string
  location: string
  description: string
  records: Record[]
}

export default function DocumentPage() {
  const params = useParams()
  const [document, setDocument] = useState<Document | null>(null)

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем моковые данные
    const mockDocument: Document = {
      id: params.id as string,
      title: "Свидетельство о рождении Иванова И.И.",
      year: "1985",
      location: "Москва, Россия",
      description: "Свидетельство о рождении Иванова Ивана Ивановича",
      records: [
        { id: "1", number: 1, name: "Иванов Иван Иванович", relation: "Сам", details: "Родился 15 мая 1985 года" },
        { id: "2", number: 2, name: "Иванов Петр Сергеевич", relation: "Отец", details: "1960 года рождения" },
        { id: "3", number: 3, name: "Иванова Мария Александровна", relation: "Мать", details: "1962 года рождения" },
      ],
    }
    setDocument(mockDocument)
  }, [params.id])

  if (!document) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
              <span>Год: {document.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Место: {document.location}</span>
            </div>
            <p className="text-muted-foreground">{document.description}</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Записи документа</h2>
        <div className="grid gap-4">
          {document.records.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
                    {record.number}
                  </span>
                  {record.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Отношение:</strong> {record.relation}
                </p>
                <p>
                  <strong>Детали:</strong> {record.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

