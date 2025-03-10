"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { templateStore } from "@/app/types/templateStore"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export default function AddTemplate() {
    const router = useRouter()
    const [template, setTemplate] = useState({
        name: "",
        relation: "",
        details: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setTemplate((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newTemplate = {
            ...template,
            id: Date.now().toString(),
        }
        templateStore.addTemplate(newTemplate)
        toast({
            title: "Шаблон добавлен",
            description: "Новый шаблон успешно создан",
        })
        router.back() // Возвращаемся на предыдущую страницу
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Добавить новый шаблон
                    </h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация о шаблоне</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Название шаблона</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={template.name}
                                        onChange={handleInputChange}
                                        placeholder="Например: Родитель"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relation">Отношение</Label>
                                    <Input
                                        id="relation"
                                        name="relation"
                                        value={template.relation}
                                        onChange={handleInputChange}
                                        placeholder="Например: Отец"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="details">Детали</Label>
                                    <Textarea
                                        id="details"
                                        name="details"
                                        value={template.details}
                                        onChange={handleInputChange}
                                        placeholder="Дополнительная информация..."
                                        rows={4}
                                    />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSubmit} className="w-full">
                                <Save className="mr-2 h-4 w-4" /> Сохранить шаблон
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}

