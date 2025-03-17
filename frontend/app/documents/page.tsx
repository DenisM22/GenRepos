"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FilterDropdown } from "@/components/filter-dropdown"
import Header from "@/components/header"
import {Calendar, Church, FileText, MapPin, Plus, Search} from "lucide-react"
import type {Document} from "@/app/types/models";
import { metricDocumentApi, confessionalDocumentApi, revisionDocumentApi } from "@/app/api/api"
import { AxiosError } from "axios"
import { YearRangeFilter } from "@/components/YearRangeFilter"

const documentTypes = [
  { value: "metric", label: "Метрическая книга" },
  { value: "confessional", label: "Исповедная ведомость" },
  { value: "revision", label: "Ревизская сказка" },
]

export default function DocumentsPage() {
  const [message, setMessage] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [query, setQuery] = useState("")

  const [selectedType, setSelectedType] = useState("all")
  const [startYear, setStartYear] = useState("")
  const [endYear, setEndYear] = useState("")

  const fetchDocuments = async () => {
    try {
      setMessage("");
      let response;
      switch (selectedType) {
        case "all":
          const [metricResponse, confessionalResponse, revisionResponse] = await Promise.all([
            metricDocumentApi.getAll(query, startYear, endYear),
            confessionalDocumentApi.getAll(query, startYear, endYear),
            revisionDocumentApi.getAll(query, startYear, endYear),
          ]);

          setDocuments([
            ...(metricResponse?.data?.map((doc: Document) => ({ ...doc, type: "metric" })) || []),
            ...(confessionalResponse?.data?.map((doc: Document) => ({ ...doc, type: "confessional" })) || []),
            ...(revisionResponse?.data?.map((doc: Document) => ({ ...doc, type: "revision" })) || []),
          ]);
          break;

        case "metric":
          response = await metricDocumentApi.getAll(query, startYear, endYear);
          setDocuments(response?.data?.map((doc: Document) => ({ ...doc, type: "metric" })) || []);
          break;

        case "confessional":
          response = await confessionalDocumentApi.getAll(query, startYear, endYear);
          setDocuments(response?.data?.map((doc: Document) => ({ ...doc, type: "confessional" })) || []);
          break;

        case "revision":
          response = await revisionDocumentApi.getAll(query, startYear, endYear);
          setDocuments(response?.data?.map((doc: Document) => ({ ...doc, type: "revision" })) || []);
          break;

        default:
          setDocuments([]);
          break;
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setDocuments([]);
        console.error(error.response?.data);
        setMessage("Ошибка при загрузке документов: " + (error.response?.data?.message || error.message));
      } else {
        console.error(error);
        setMessage("Неизвестная ошибка");
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDocuments()
  }

  const handleTypeSelect = (value: string) => {
    if (selectedType == value)
      setSelectedType("all")
    else
      setSelectedType(value)
  }

  const handleYearRangeChange = (start: string, end: string) => {
    setStartYear(start)
    setEndYear(end)
  }

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Документы</h1>
            <Link href="/documents/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Добавить документ
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px_220px] mb-8">
            <div className="relative">
              <SearchBar placeholder="Поиск документов..." onSearch={setQuery} />
              <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={(e) => handleSearch(e)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <FilterDropdown options={documentTypes} placeholder="Тип документа" onSelect={handleTypeSelect} />
            <YearRangeFilter placeholder="Год создания" onRangeChange={handleYearRangeChange} />
          </div>

          {message && <p className="mt-4 text-center text-red-500">{message}</p>}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
                <Link href={`/documents/${doc.type}/${doc.id}`} key={doc.id}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{doc.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Год создания: {doc.createdAt}</span>
                        </div>

                        {doc.parish && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Church className="h-4 w-4 flex-shrink-0" />
                              <span>Приход: {doc.parish.parish}</span>
                            </div>
                        )}

                        {doc.place && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span>Место: {doc.place.volost.uyezd.uyezd} уезд, {doc.place.volost.volost}, {doc.place.place}</span>
                            </div>
                        )}

                      </div>
                    </CardContent>
                  </Card>
                </Link>
            ))}
          </div>
        </main>
      </div>
  )
}
