"use client"

import { useState} from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Search } from "lucide-react"
import type { Person } from "../types/models"
import { personApi } from "../api/api"
import { useDebounce } from "@/hooks/useDebounce"
import {AxiosError} from "axios";

export default function PersonListAndSearch() {
    const [message, setMessage] = useState('')
    const [people, setPeople] = useState<Person[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const fetchPeople = async () => {
        try {
            const response = await personApi.getAll(debouncedSearchTerm)
            setPeople(response.data)
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                setMessage('Ошибка при загрузке людей: ' + (error.response?.data?.message || error.message));
            } else {
                console.error(error);
                setMessage('Неизвестная ошибка');
            }
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchPeople()
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        type="text"
                        placeholder="Поиск людей..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit">Поиск</Button>
            </form>

            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map((person) => (
                    <Card key={person.id} className="card-hover">
                        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                            <User size={24} className="text-primary"/>
                            <CardTitle
                                className="text-xl"> {person.lastName} {person.firstName} {person.middleName} </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{person.birthDate?.exactDate} - {person.deathDate?.exactDate}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

