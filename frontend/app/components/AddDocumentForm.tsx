"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import {documentApi} from "@/app/api/api";

export default function AddDocumentForm() {
  const [document, setDocument] = useState({ title: "", yearOfCreation: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await documentApi.save(document)
    console.log("Saving document:", document)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <PlusCircle className="mr-2" />
          Добавить новый документ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Название документа"
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Год создания"
            value={document.yearOfCreation}
            onChange={(e) => setDocument({ ...document, yearOfCreation: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Добавить документ
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

