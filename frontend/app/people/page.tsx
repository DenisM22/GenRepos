"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { FilterDropdown } from "@/components/filter-dropdown"
import Header from "@/components/header"
import {User, Plus, Search, Calendar, MapPin} from "lucide-react"
import type { Person } from "@/app/types/models"
import { personApi } from "@/app/api/api"
import {AxiosError} from "axios"
import { YearRangeFilter } from "@/components/YearRangeFilter"

const uyezdOptions = [
  { value: "velskiy", label: "Вельский" },
  { value: "vologodskiy", label: "Вологодский" },
  { value: "gryazovetskiy", label: "Грязовецкий" },
  { value: "kadnikovskiy", label: "Кадниковский" },
  { value: "nikolskiy", label: "Никольский" },
  { value: "solvychegodskiy", label: "Сольвычегодский" },
  { value: "totemskiy", label: "Тотемский" },
  { value: "ust-sysolskiy", label: "Усть-Сысольский" },
  { value: "ustyuzhskiy", label: "Устюжский" },
  { value: "yarenskiy", label: "Яренский" },
]

export default function PeoplePage() {
  const [message, setMessage] = useState('')
  const [people, setPeople] = useState<Person[]>([])
  const [query, setQuery] = useState("")
  const [selectedUyezd, setSelectedUyezd] = useState("")
  const [startBirthYear, setStartBirthYear] = useState("")
  const [endBirthYear, setEndBirthYear] = useState("")

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

  const handleUyezdSelect = (value: string) => {
    setSelectedUyezd(value)
  }

  const handleBirthYearRangeChange = (start: string, end: string) => {
    setStartBirthYear(start)
    setEndBirthYear(end)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPeople()
  }

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Люди</h1>
            <Link href="/people/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Добавить человека
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px_220px] mb-8">
            <div className="relative">
              <SearchBar placeholder="Поиск людей..." onSearch={setQuery} />
              <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={(e) => handleSearch(e)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <FilterDropdown options={uyezdOptions} placeholder="Уезд" onSelect={handleUyezdSelect} />
            <YearRangeFilter placeholder="Год рождения" onRangeChange={handleBirthYearRangeChange} />
          </div>

          {message && <p className="mt-4 text-center text-red-500">{message}</p>}


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
                <Link href={`/people/${person.id}`} key={person.id}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{person.firstName}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Дата рождения:{" "}
                            {person.birthDate ? (
                                person.birthDate.description === "Диапазон" ? (
                                    `между ${person.birthDate.startDate} и ${person.birthDate.endDate}`
                                ) : person.birthDate.description === "Точная дата" ? (
                                    person.birthDate.exactDate
                                ) : (
                                    person.birthDate.description.toLowerCase() + " " + person.birthDate.exactDate
                                )
                            ) : (
                                "Не указана"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>Уезд: {uyezdOptions.find((u) => u.value === person.uyezd)?.label}</span>
                        </div>
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
