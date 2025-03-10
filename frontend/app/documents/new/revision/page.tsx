"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Book, FileText, Check } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

const steps = [
    { id: 1, icon: FileText },
    { id: 2, icon: Book },
    { id: 3, icon: Check },
]

export default function RevisionDocument() {
    const router = useRouter()
    const [step, setStep] = useState(1)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Здесь будет логика отправки данных на сервер
        router.push("/documents")
    }

    const nextStep = () => {
        if (step < 3) setStep(step + 1)
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Новый документ: Ревизская сказка
                    </h1>
                    <div className="relative pt-4">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                            <motion.div
                                style={{ width: `${(step / 3) * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="flex justify-between absolute top-0 w-full">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                        step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    <s.icon className="h-5 w-5" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Book className="h-6 w-6 text-primary" />
                            {step === 1 && "Основная информация"}
                            {step === 2 && "Записи документа"}
                            {step === 3 && "Проверка"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Здесь будет содержимое для каждого шага */}
                        {step === 1 && <p>Форма для основной информации ревизской сказки.</p>}
                        {step === 2 && <p>Форма для записей ревизской сказки.</p>}
                        {step === 3 && <p>Проверка введенных данных.</p>}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {step > 1 && (
                            <Button onClick={prevStep} variant="outline">
                                Назад
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button onClick={nextStep} className="ml-auto">
                                Далее
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="ml-auto">
                                <Save className="h-5 w-5 mr-2" />
                                Сохранить
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}

