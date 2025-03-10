"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Users, Book } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const documentTypes = [
    { id: "metric", title: "Метрическая книга", icon: FileText, path: "/documents/new/metric" },
    { id: "confessional", title: "Исповедная ведомость", icon: Users, path: "/documents/new/confessional" },
    { id: "revision", title: "Ревизская сказка", icon: Book, path: "/documents/new/revision" },
]

export default function NewDocument() {
    const router = useRouter()
    const [selectedType, setSelectedType] = useState<string | null>(null)

    const handleSelectType = (id: string, path: string) => {
        setSelectedType(id)
        router.push(path)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-3xl font-bold mb-8 text-center">Выберите тип документа</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {documentTypes.map((type) => (
                            <Card
                                key={type.id}
                                className={`cursor-pointer transition-all ${
                                    selectedType === type.id ? "ring-2 ring-primary" : "hover:shadow-md"
                                }`}
                                onClick={() => handleSelectType(type.id, type.path)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <type.icon className="h-6 w-6 text-primary" />
                                        {type.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full">Выбрать</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

