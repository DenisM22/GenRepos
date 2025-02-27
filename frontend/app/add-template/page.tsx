"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Save } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { Template, Uyezd, Volost, Place } from "@/app/types/models"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"

export default function AddTemplate() {
  const router = useRouter()
  const [template, setTemplate] = useState<Omit<Template, "id">>({
    name: "",
    name: "",
    relation: "",
    details: "",
  })

  const [uyezds, setUyezds] = useState<Uyezd[]>([])
  const [volosts, setVolosts] = useState<Volost[]>([])
  const [places, setPlaces] = useState<Place[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTemplate((prev) => ({ ...prev, [name]: value }))
  }

  const handleUyezdSelect = (value: string) => {
    setTemplate((prev) => ({
      ...prev,
      uyezd: { id: Number.parseInt(value), uyezd: uyezds.find((u) => u.id === Number.parseInt(value))?.uyezd },
      volost: undefined,
      place: undefined,
    }))
    // В реальном приложении здесь был бы запрос к API для получения списка волостей по id уезда
    setVolosts([
      { id: 1, volost: "Волость 1" },
      { id: 2, volost: "Волость 2" },
      { id: 3, volost: "Волость 3" },
    ])
  }

  const handleVolostSelect = (value: string) => {
    setTemplate((prev) => ({
      ...prev,
      volost: { id: Number.parseInt(value), volost: volosts.find((v) => v.id === Number.parseInt(value))?.volost },
      place: undefined,
    }))
    // В реальном приложении здесь был бы запрос к API для получения списка мест по id волости
    setPlaces([
      { id: 1, place: "Место 1" },
      { id: 2, place: "Место 2" },
      { id: 3, place: "Место 3" },
    ])
  }

  const handlePlaceSelect = (value: string) => {
    setTemplate((prev) => ({
      ...prev,
      place: { id: Number.parseInt(value), place: places.find((p) => p.id === Number.parseInt(value))?.place },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted template:", template)
    // Здесь будет логика отправки данных на сервер
    // После сохранения шаблона, возвращаемся на страницу добавления документа
    // и передаем ID нового шаблона в качестве параметра
    router.push(`/add-document?templateId=${Date.now().toString()}`)
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
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Добавить шаблон</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Название шаблона</Label>
                <Input
                  id="templateName"
                  name="name"
                  value={template.name}
                  onChange={handleInputChange}
                  placeholder="Например: Родитель"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templatePersonName">Имя</Label>
                <Input
                  id="templatePersonName"
                  name="name"
                  value={template.name}
                  onChange={handleInputChange}
                  placeholder="Например: Иванов Иван Иванович"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateRelation">Отношение</Label>
                <Input
                  id="templateRelation"
                  name="relation"
                  value={template.relation}
                  onChange={handleInputChange}
                  placeholder="Например: Отец"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateDetails">Детали</Label>
                <Textarea
                  id="templateDetails"
                  name="details"
                  value={template.details}
                  onChange={handleInputChange}
                  placeholder="Дополнительная информация..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uyezd">Уезд</Label>
                <Select onValueChange={handleUyezdSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уезд" />
                  </SelectTrigger>
                  <SelectContent>
                    {uyezds.map((uyezd) => (
                      <SelectItem key={uyezd.id} value={uyezd.id.toString()}>
                        {uyezd.uyezd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {template.uyezd && (
                <div className="space-y-2">
                  <Label htmlFor="volost">Волость</Label>
                  <Combobox
                    items={volosts.map((v) => ({ id: v.id.toString(), name: v.volost || "" }))}
                    placeholder="Выберите или введите волость"
                    onSelect={handleVolostSelect}
                  />
                </div>
              )}
              {template.volost && (
                <div className="space-y-2">
                  <Label htmlFor="place">Место</Label>
                  <Combobox
                    items={places.map((p) => ({ id: p.id.toString(), name: p.place || "" }))}
                    placeholder="Выберите или введите место"
                    onSelect={handlePlaceSelect}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/add-document")} className="gap-2 text-base">
                <ChevronLeft className="h-5 w-5" />
                Назад
              </Button>
              <Button onClick={handleSubmit} className="gap-2 text-base">
                <Save className="h-5 w-5" />
                Сохранить шаблон
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

