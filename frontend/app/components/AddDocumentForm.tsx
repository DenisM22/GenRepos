"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlusCircle, X, Upload } from "lucide-react"
import {Document, FuzzyDate, PersonFromDocument} from "@/app/types/models"
import {autocompleteApi, documentApi, personApi} from "@/app/api/api"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function AddDocumentForm() {
  const [message, setMessage] = useState('')
  const [document, setDocument] = useState<Document>({})
  const [suggestions, setSuggestions] = useState<{
    firstName: string[];
    lastName: string[];
    middleName: string[];
    place: string[];
  }>({
        firstName: [],
        lastName: [],
        middleName: [],
        place: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await documentApi.save(document)
      console.log("Документ успешно сохранен")
      setMessage("Документ успешно сохранен")
      setDocument({})
    } catch (error) {
      console.error("Ошибка при сохранении документа:", error)
    }
  }

  const handleInputChange = useCallback(async (field: keyof Document | keyof PersonFromDocument, value: string, personIndex?: number) => {
    if (personIndex !== undefined) {
      setDocument((prev) => ({
        ...prev,
        people:
            prev.people?.map((person, index) => (index === personIndex ? { ...person, [field]: value } : person)) || [],
      }))
    } else {
      setDocument((prev) => ({ ...prev, [field]: value }))
    }
    if (personIndex !== undefined && value.length>1) {
          try {
            let response
            switch (field) {
              case "firstName":
                response = await autocompleteApi.getFirstNames(value)
                break
              case "lastName":
                response = await autocompleteApi.getLastNames(value)
                break
              case "middleName":
                response = await autocompleteApi.getMiddleNames(value)
                break
              case "place":
                response = await autocompleteApi.getPlaces(value)
                break
            }
            setSuggestions((prev) => ({...prev, [field]: response?.data || []}))
          } catch (error) {
            console.error(`Ошибка загрузки ${field}:`, error)
          }
        } else {
          setSuggestions((prev) => ({...prev, [field]: []}))
        }
      }, [])

  const handleSuggestionClick = (
      field: keyof Document | keyof PersonFromDocument,
      suggestion: string,
      personIndex?: number,
  ) => {
    if (personIndex !== undefined) {
      setDocument((prev) => ({
        ...prev,
        people:
            prev.people?.map((person, index) => (index === personIndex ? { ...person, [field]: suggestion } : person)) ||
            [],
      }))
    } else {
      setDocument((prev) => ({ ...prev, [field]: suggestion }))
    }
    setSuggestions((prev) => ({ ...prev, [field]: [] }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Читаем файл как Base64
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const cleanedBase64 = base64String.split(",")[1]; // Убираем "data:image/png;base64,"

        setDocument((prev) => ({
          ...prev,
          image: cleanedBase64, // Теперь это чистая Base64-строка
        }));
      };
    }
  };


  const handleAddPerson = () => {
    setDocument((prev) => ({
      ...prev,
      people: [...(prev.people || []), {}],
    }))
  }

  const handleRemovePerson = (index: number) => {
    setDocument((prev) => ({
      ...prev,
      people: prev.people?.filter((_, i) => i !== index),
    }))
  }

  const renderInput = (
      field: keyof Document | keyof PersonFromDocument,
      label: string,
      type = "text",
      personIndex?: number,
  ) => {
    const value =
        personIndex !== undefined
            ? document.people?.[personIndex]?.[field as keyof PersonFromDocument] || ""
            : document[field as keyof Document] || ""

    return (
        <div className="space-y-2">
          <Label htmlFor={personIndex !== undefined ? `${field}-${personIndex}` : field}>{label}</Label>
          <div className="relative">
            <Input
                id={personIndex !== undefined ? `${field}-${personIndex}` : field}
                name={field}
                type={type}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value, personIndex)}
                placeholder={`Введите ${label.toLowerCase()}`}
                className="w-full"
            />
            {suggestions[field as keyof typeof suggestions]?.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                  {suggestions[field as keyof typeof suggestions].map((suggestion, index) => (
                      <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(field, suggestion, personIndex)}
                      >
                        {suggestion}
                      </li>
                  ))}
                </ul>
            )}
          </div>
        </div>
    )
  }

  const renderDateInput = (field: "birthDate" | "deathDate", label: string) => {
    const date = document.people[field]

    return (
        <div>
          <label className="block mb-1 text-gray-700">{label}</label>
          <Select
              value={date?.description || ""}
              onValueChange={(value) => handleDateChange(field, "description", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип даты"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Точная дата">Точная дата</SelectItem>
              <SelectItem value="Диапазон">Диапазон</SelectItem>
              <SelectItem value="До">До</SelectItem>
              <SelectItem value="После">После</SelectItem>
              <SelectItem value="Около">Около</SelectItem>
            </SelectContent>
          </Select>

          {["До", "После", "Около", "Точная дата"].includes(date?.description || "") && (
              <Input
                  type="date"
                  required={true}
                  value={date?.exactDate || ""}
                  onChange={(e) => handleDateChange(field, "exactDate", e.target.value)}
                  className="mt-2"
              />
          )}

          {date?.description === "Диапазон" && (
              <div className="mt-2 flex gap-2">
                <Input
                    type="date"
                    placeholder="Начальная дата"
                    required={true}
                    value={date.startDate || ""}
                    onChange={(e) => handleDateChange(field, "startDate", e.target.value)}
                />
                <Input
                    type="date"
                    placeholder="Конечная дата"
                    required={true}
                    value={date.endDate || ""}
                    onChange={(e) => handleDateChange(field, "endDate", e.target.value)}
                />
              </div>
          )}

        </div>
    )
  }

  const handleDateChange = (field: "birthDate" | "deathDate", key: keyof FuzzyDate, value: string) => {
    setDocument((prev) => ({
      ...prev,
      people:
          prev.people?.map((person, index) => (index === personIndex ? { ...person, [field]: value } : person)) || [],
    }))
  }

  return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PlusCircle className="mr-2" />
            Добавить новый документ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {renderInput("title", "Название документа")}
              {renderInput("yearOfCreation", "Год создания", "number")}
              {renderInput("parish", "Приход")}
              {renderInput("place", "Место")}
              {renderInput("household", "Домохозяйство")}
              <div className="space-y-2">
                <Label htmlFor="image">Изображение</Label>
                <div className="flex items-center space-x-2">
                  <Input id="image" name="image" type="file" onChange={handleImageUpload} className="hidden" />
                  <Label
                      htmlFor="image"
                      className="cursor-pointer flex items-center justify-center w-full h-10 border-2 border-dashed rounded-md hover:border-primary"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="text-sm">{document.image ? document.image.name : "Выберите изображение"}</span>
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Люди в документе</Label>
                <Button type="button" onClick={handleAddPerson} variant="outline">
                  Добавить человека
                </Button>
              </div>
              {document.people?.map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Человек {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemovePerson(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {renderInput("lastName", "Фамилия", "text", index)}
                      {renderInput("firstName", "Имя", "text", index)}
                      {renderInput("middleName", "Отчество", "text", index)}
                      {renderDateInput("birthDate", "Дата рождения")}
                      {renderDateInput("deathDate", "Дата смерти")}
                      {renderInput("socialStatus", "Социальный статус", "text", index)}
                      {renderInput("familyStatus", "Семейный статус", "text", index)}
                    </div>
                  </Card>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Добавить документ
            </Button>
          </form>
        </CardContent>
      </Card>
  )
}
