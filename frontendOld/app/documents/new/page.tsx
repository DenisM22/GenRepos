"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function NewDocument() {
    const router = useRouter()
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

    const handleSelection = (docType: string) => {
        setSelectedDocument(docType)
        router.push(`/documents/new/${docType}`) // Перенаправление на нужную страницу
    }

    return (
        <div className="container mx-auto py-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Создать новый документ</h1>

            <div className="flex justify-center space-x-4">
                <Button variant={selectedDocument === "metric" ? "default" : "outline"} onClick={() => handleSelection("metric")}>
                    Метрическая книга
                </Button>
                <Button variant={selectedDocument === "confessional" ? "default" : "outline"} onClick={() => handleSelection("confessional")}>
                    Исповедная ведомость
                </Button>
                <Button variant={selectedDocument === "revision" ? "default" : "outline"} onClick={() => handleSelection("revision")}>
                    Ревизская сказка
                </Button>
            </div>
        </div>
    )
}
