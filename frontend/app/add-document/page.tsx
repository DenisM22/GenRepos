"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Save,
  FileText,
  Users,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  LayoutTemplateIcon as Template,
} from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Record } from "@/app/types/models"
import type { Template } from "@/app/types/models" // Assuming Template type is defined here

export default function AddDocument() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [document, setDocument] = useState({
    title: "",
    year: "",
    location: "",
    description: "",
    records: [] as Record[],
  })
  const [currentTemplate, setCurrentTemplate] = useState<Template>("")

  useEffect(() => {
    const templateId = new URLSearchParams(window.location.search).get("templateId")
    if (templateId) {
      // В реальном приложении здесь был бы запрос к API для получения шаблона по ID
      const fetchedTemplate = {
        id: templateId,
        name: "Новый шаблон",
        name: "Новое имя",
        relation: "Новое отношение",
        details: "Новые детали",
      }
      setCurrentTemplate(fetchedTemplate)
    }
  }, [])

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API для получения шаблонов
    const fetchedTemplates = [
      {
        id: "1",
        name: "Шаблон 1",
        relation: "Отец",
        details: "Родился в 1950 году",
        uyezd: null,
        volost: null,
        place: null,
      },
      {
        id: "2",
        name: "Шаблон 2",
        relation: "Мать",
        details: "Родилась в 1955 году",
        uyezd: null,
        volost: null,
        place: null,
      },
    ]
    // Устанавливаем первый шаблон как текущий
    if (fetchedTemplates.length > 0 && !currentTemplate) {
      setCurrentTemplate(fetchedTemplates[0])
    }
  }, [currentTemplate]) // Added currentTemplate to dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDocument((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecordChange = useCallback((id: string, field: string, value: string) => {
    setDocument((prev) => ({
      ...prev,
      records: prev.records.map((record) => (record.id === id ? { ...record, [field]: value } : record)),
    }))
  }, [])

  const addRecord = () => {
    const newRecord: Record = {
      id: Date.now().toString(),
      number: document.records.length + 1,
      name: currentTemplate?.name || "",
      relation: currentTemplate?.relation || "",
      details: currentTemplate?.details || "",
      uyezd: currentTemplate?.uyezd || null,
      volost: currentTemplate?.volost || null,
      place: currentTemplate?.place || null,
    }
    setDocument((prev) => ({
      ...prev,
      records: [...prev.records, newRecord],
    }))
  }

  const removeRecord = useCallback((id: string) => {
    setDocument((prev) => {
      const updatedRecords = prev.records.filter((record) => record.id !== id)
      return {
        ...prev,
        records: updatedRecords.map((record, index) => ({ ...record, number: index + 1 })),
      }
    })
  }, [])

  const nextStep = () => {
    setDirection(1)
    setStep(2)
  }

  const prevStep = () => {
    setDirection(-1)
    setStep(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted document:", document)
    // Здесь будет логика отправки данных на сервер
    router.push("/documents")
  }

  const removeTemplate = () => {
    setCurrentTemplate(null)
  }

  const RecordItem = useCallback(
    ({ record }: { record: Record }) => (
      <div className="p-4 border rounded-lg space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">
              {record.number}
            </span>
            <span>Запись</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeRecord(record.id)}
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`name-${record.id}`} className="text-base">
            Имя
          </Label>
          <Input
            id={`name-${record.id}`}
            value={record.name}
            onChange={(e) => handleRecordChange(record.id, "name", e.target.value)}
            className="h-10 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`relation-${record.id}`} className="text-base">
            Отношение
          </Label>
          <Input
            id={`relation-${record.id}`}
            value={record.relation}
            onChange={(e) => handleRecordChange(record.id, "relation", e.target.value)}
            className="h-10 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`details-${record.id}`} className="text-base">
            Детали
          </Label>
          <Textarea
            id={`details-${record.id}`}
            value={record.details}
            onChange={(e) => handleRecordChange(record.id, "details", e.target.value)}
            rows={2}
            className="resize-none text-base"
          />
        </div>
      </div>
    ),
    [handleRecordChange, removeRecord],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Новый документ
          </h1>
          <p className="text-muted-foreground mb-8">Добавьте информацию о документе и связанных с ним людях</p>

          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} transition-colors duration-300`}
              >
                1
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-primary rounded-full transition-all duration-500 ease-in-out ${step === 2 ? "w-full" : "w-0"}`}
                ></div>
              </div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} transition-colors duration-300`}
              >
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm font-medium">
              <span className={step === 1 ? "text-primary" : "text-muted-foreground"}>Основная информация</span>
              <span className={step === 2 ? "text-primary" : "text-muted-foreground"}>Записи документа</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-lg">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step}
                custom={direction}
                initial={{
                  x: direction > 0 ? 300 : -300,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: direction < 0 ? 300 : -300,
                  opacity: 0,
                }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {step === 1 ? (
                  <Card className="border-none shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        Основная информация
                      </CardTitle>
                      <CardDescription>Введите основные данные о добавляемом документе</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-base">
                          Название документа
                        </Label>
                        <div className="relative">
                          <Input
                            id="title"
                            name="title"
                            placeholder="Например: Свидетельство о рождении"
                            value={document.title}
                            onChange={handleInputChange}
                            className="pl-10 h-12 text-base"
                          />
                          <FileText className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-base">
                          Год создания
                        </Label>
                        <div className="relative">
                          <Input
                            id="year"
                            name="year"
                            placeholder="Например: 1945"
                            value={document.year}
                            onChange={handleInputChange}
                            className="pl-10 h-12 text-base"
                          />
                          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-base">
                          Место
                        </Label>
                        <div className="relative">
                          <Input
                            id="location"
                            name="location"
                            placeholder="Например: Москва, Россия"
                            value={document.location}
                            onChange={handleInputChange}
                            className="pl-10 h-12 text-base"
                          />
                          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-base">
                          Описание
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Краткое описание документа..."
                          value={document.description}
                          onChange={handleInputChange}
                          rows={4}
                          className="resize-none text-base"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        onClick={nextStep}
                        size="lg"
                        className="ml-auto gap-2 text-base group relative overflow-hidden"
                      >
                        <span className="relative z-10">Далее</span>
                        <ChevronRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="border-none shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        Записи документа
                      </CardTitle>
                      <CardDescription>Добавьте людей, упомянутых в документе</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentTemplate && (
                        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Текущий шаблон: {currentTemplate.name}</h3>
                            <Button variant="ghost" size="sm" onClick={removeTemplate}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить шаблон
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Имя: {currentTemplate.name}, Отношение: {currentTemplate.relation}
                          </p>
                        </div>
                      )}
                      <ScrollArea className="h-[50vh] pr-4">
                        {document.records.map((record) => (
                          <RecordItem key={record.id} record={record} />
                        ))}
                      </ScrollArea>
                      <div className="flex gap-4 mt-4">
                        <Button variant="outline" onClick={addRecord} className="w-full h-12 text-base border-dashed">
                          <Plus className="mr-2 h-4 w-4" /> Добавить запись
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/add-template")}
                          className="w-full h-12 text-base border-dashed"
                        >
                          <Template className="mr-2 h-4 w-4" /> Добавить шаблон
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        size="lg"
                        className="gap-2 text-base group relative overflow-hidden"
                      >
                        <ChevronLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                        <span className="relative z-10">Назад</span>
                        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        size="lg"
                        className="gap-2 text-base group relative overflow-hidden"
                      >
                        <span className="relative z-10">Сохранить</span>
                        <Save className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

