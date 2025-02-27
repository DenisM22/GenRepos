"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import type { Uyezd, Volost, Place } from "@/app/types/models"

export default function AddPersonPage() {
  const router = useRouter()
  const [uyezds, setUyezds] = useState<Uyezd[]>([])
  const [volosts, setVolosts] = useState<Volost[]>([])
  const [places, setPlaces] = useState<Place[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthYear: "",
    uyezdId: "",
    volostId: "",
    placeId: "",
  })

  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API для получения списка уездов
    setUyezds([
      { id: 1, uyezd: "Уезд 1" },
      { id: 2, uyezd: "Уезд 2" },
      { id: 3, uyezd: "Уезд 3" },
    ])
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUyezdSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, uyezdId: value, volostId: "", placeId: "" }))
    // В реальном приложении здесь был бы запрос к API для получения списка волостей по id уезда
    setVolosts([
      { id: 1, volost: "Волость 1" },
      { id: 2, volost: "Волость 2" },
      { id: 3, volost: "Волость 3" },
    ])
  }

  const handleVolostSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, volostId: value, placeId: "" }))
    // В реальном приложении здесь был бы запрос к API для получения списка мест по id волости
    setPlaces([
      { id: 1, place: "Место 1" },
      { id: 2, place: "Место 2" },
      { id: 3, place: "Место 3" },
    ])
  }

  const handlePlaceSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, placeId: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted form data:", formData)
    // Здесь будет логика отправки данных на сервер
    router.push("/people")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Добавить человека</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthYear">Год рождения</Label>
                <Input
                  id="birthYear"
                  name="birthYear"
                  type="number"
                  value={formData.birthYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uyezd">Уезд</Label>
                <Select onValueChange={handleUyezdSelect} value={formData.uyezdId}>
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
              {formData.uyezdId && (
                <div className="space-y-2">
                  <Label htmlFor="volost">Волость</Label>
                  <Combobox
                    items={volosts.map((v) => ({ id: v.id.toString(), name: v.volost || "" }))}
                    placeholder="Выберите или введите волость"
                    onSelect={handleVolostSelect}
                  />
                </div>
              )}
              {formData.volostId && (
                <div className="space-y-2">
                  <Label htmlFor="place">Место</Label>
                  <Combobox
                    items={places.map((p) => ({ id: p.id.toString(), name: p.place || "" }))}
                    placeholder="Выберите или введите место"
                    onSelect={handlePlaceSelect}
                  />
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              Добавить
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

