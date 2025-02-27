"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FilterDropdown } from "@/components/filter-dropdown"
import Header from "@/components/header"
import { User, Plus } from "lucide-react"
import type { Person } from "@/app/types/models"
import { personApi } from "@/app/api/api"
import {AxiosError} from "axios"

const relationOptions = [
  { value: "parent", label: "Родитель" },
  { value: "child", label: "Ребенок" },
  { value: "spouse", label: "Супруг(а)" },
  { value: "sibling", label: "Брат/Сестра" },
]

const birthYearOptions = [
  { value: "1900-1950", label: "1900-1950" },
  { value: "1951-2000", label: "1951-2000" },
  { value: "2001-present", label: "2001-настоящее время" },
]

export default function PeoplePage() {
  const [message, setMessage] = useState('')
  const [people, setPeople] = useState<Person[]>([])
  const [query, setQuery] = useState("")

  const [selectedRelation, setSelectedRelation] = useState("")
  const [selectedBirthYear, setSelectedBirthYear] = useState("")

  const fetchPeople = async () => {
    try {
      const response = await personApi.getAll(query)
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

  const handleRelationSelect = (value: string) => {
    setSelectedRelation(value)
    // Здесь будет логика фильтрации по отношению
  }

  const handleBirthYearSelect = (value: string) => {
    setSelectedBirthYear(value)
    // Здесь будет логика фильтрации по году рождения
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Люди</h1>
          <Link href="/add-person">
            <Button>
              <Plus className="mr-2 h-4 w-4"/> Добавить человека
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-[1fr_200px_200px] mb-8">
            <SearchBar
                placeholder="Поиск людей..."
                onSearch={setQuery}/>
            <FilterDropdown
                options={relationOptions}
                placeholder="Отношение"
                onSelect={handleRelationSelect}/>
            <FilterDropdown
                options={birthYearOptions}
                placeholder="Год рождения"
                onSelect={handleBirthYearSelect}/>
          </div>
          <Button type="submit">Поиск</Button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
                <Link href={`/people/${person.id}`} key={person.id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-primary"/>
                        {person.firstName} {person.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Год рождения: {person.birthDate?.exactDate}</p>
                      <p className="text-sm text-muted-foreground">
                        Отношение: {relationOptions.find((r) => r.value === person.socialStatus)?.label}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
            ))}
          </div>
      </main>
    </div>
)
}

