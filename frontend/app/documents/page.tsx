"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FilterDropdown } from "@/components/filter-dropdown"
import Header from "@/components/header"
import {FileText, Plus, Search} from "lucide-react"
import type {ConfessionalDocument, MetricDocument, RevisionDocument} from "@/app/types/models";
import { metricDocumentApi, confessionalDocumentApi, revisionDocumentApi } from "@/app/api/api"
import { AxiosError } from "axios"

const documentTypes = [
  { value: "birth", label: "Свидетельство о рождении" },
  { value: "marriage", label: "Свидетельство о браке" },
  { value: "death", label: "Свидетельство о смерти" },
]

const yearOptions = [
  { value: "1900-1950", label: "1900-1950" },
  { value: "1951-2000", label: "1951-2000" },
  { value: "2001-present", label: "2001-настоящее время" },
]

export default function DocumentsPage() {
  const [message, setMessage] = useState('')
  const [documents, setDocuments] = useState<MetricDocument[] | ConfessionalDocument[] | RevisionDocument[]>([])
  const [query, setQuery] = useState("")
  const [selectedApi, setSelectedApi] = useState<string>("confessionalDocumentApi")

  const [selectedType, setSelectedType] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const fetchDocuments = async () => {
    try {
      const [metricResponse, confessionalResponse, revisionResponse] = await Promise.all([
        metricDocumentApi.getAll(query),
        confessionalDocumentApi.getAll(query),
        revisionDocumentApi.getAll(query)
      ]);

      // Объединяем данные в один массив
      setDocuments([
        ...(metricResponse?.data || []),
        ...(confessionalResponse?.data || []),
        ...(revisionResponse?.data || [])
      ]);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setDocuments([]); // В случае ошибки очищаем список
        console.error(error.response?.data)
        setMessage('Ошибка при загрузке документов: ' + (error.response?.data?.message || error.message))
      } else {
        console.error(error)
        setMessage('Неизвестная ошибка')
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDocuments()
  }

  const handleTypeSelect = (value: string) => {
    setSelectedType(value)
    // Здесь будет логика фильтрации по типу документа
  }

  const handleYearSelect = (value: string) => {
    setSelectedYear(value)
    // Здесь будет логика фильтрации по году
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Документы</h1>
          <Link href="/documents/new">
            <Button>
              <Plus className="mr-2 h-4 w-4"/> Добавить документ
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_200px_200px] mb-8">
          <div className="relative">
            <SearchBar placeholder="Поиск документов..." onSearch={setQuery}/>
            <Button
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={(e) => handleSearch(e)}>
              <Search className="h-4 w-4"/>
            </Button>
          </div>
          <FilterDropdown
              options={documentTypes}
              placeholder="Тип документа"
              onSelect={handleTypeSelect}/>
          <FilterDropdown
              options={yearOptions}
              placeholder="Год создания"
              onSelect={handleYearSelect}/>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
              <Link href={`/documents/${doc.id}`} key={doc.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary"/>
                      {doc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Год: {doc.createdAt}</p>
                  </CardContent>
                </Card>
              </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

