"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Search } from "lucide-react"
import type { Document } from "../types/models"
import { documentApi } from "@/app/api/api"
import { useDebounce } from "@/hooks/useDebounce"
import { AxiosError } from "axios"

export default function DocumentSearch() {
    const [message, setMessage] = useState('')
    const [documents, setDocuments] = useState<Document[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const fetchDocuments = async () => {
        try {
            const response = await documentApi.getAll(debouncedSearchTerm)
            setDocuments(response.data)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                setMessage('Ошибка при загрузке документов: ' + (error.response?.data?.message || error.message));
            } else {
                console.error(error);
                setMessage('Неизвестная ошибка');
            }
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchDocuments()
    }

    return (
        <div className="space-y-4">

            <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="text"
                        placeholder="Поиск документов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">Поиск</Button>
            </form>

            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <Card key={doc.id} className="card-hover">
                        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                            <FileText size={24} className="text-primary"/>
                            <CardTitle className="text-xl">{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Год создания: {doc.yearOfCreation}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}
