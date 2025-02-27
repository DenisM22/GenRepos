"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Template } from "@/app/types/models"
import { Plus, Check } from "lucide-react"

interface TemplateManagerProps {
  templates: Template[]
  onSelect: (template: Template) => void
  onAdd: (template: Template) => void
}

export function TemplateManager({ templates, onSelect, onAdd }: TemplateManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Omit<Template, "id">>({
    name: "",
    name: "",
    relation: "",
    details: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTemplate((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTemplate = () => {
    const templateWithId = { ...newTemplate, id: Date.now().toString() }
    onAdd(templateWithId)
    setNewTemplate({ name: "", name: "", relation: "", details: "" })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Шаблоны записей</h3>
      {templates.map((template) => (
        <Card
          key={template.id}
          className="hover:bg-accent transition-colors cursor-pointer"
          onClick={() => onSelect(template)}
        >
          <CardHeader>
            <CardTitle className="text-base">{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{template.name}</p>
            <p className="text-sm text-muted-foreground">{template.relation}</p>
          </CardContent>
        </Card>
      ))}
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Новый шаблон</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Название шаблона</Label>
              <Input
                id="templateName"
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                placeholder="Например: Родитель"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templatePersonName">Имя</Label>
              <Input
                id="templatePersonName"
                name="name"
                value={newTemplate.name}
                onChange={handleInputChange}
                placeholder="Например: Иванов Иван Иванович"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateRelation">Отношение</Label>
              <Input
                id="templateRelation"
                name="relation"
                value={newTemplate.relation}
                onChange={handleInputChange}
                placeholder="Например: Отец"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateDetails">Детали</Label>
              <Textarea
                id="templateDetails"
                name="details"
                value={newTemplate.details}
                onChange={handleInputChange}
                placeholder="Дополнительная информация..."
                rows={3}
              />
            </div>
            <Button onClick={handleAddTemplate} className="w-full">
              <Check className="mr-2 h-4 w-4" /> Сохранить шаблон
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Добавить новый шаблон
        </Button>
      )}
    </div>
  )
}

