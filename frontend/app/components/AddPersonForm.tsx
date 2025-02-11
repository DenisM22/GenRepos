"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { autocompleteApi } from "../api/api"
import { useDebounce } from "@/hooks/useDebounce"

type PersonField = "firstName" | "lastName" | "middleName"

export default function AddPersonForm() {
  const [person, setPerson] = useState({ firstName: "", lastName: "", middleName: "" })
  const [suggestions, setSuggestions] = useState({ firstName: [], lastName: [], middleName: [] })

  const debouncedFirstName = useDebounce(person.firstName, 300)
  const debouncedLastName = useDebounce(person.lastName, 300)
  const debouncedMiddleName = useDebounce(person.middleName, 300)

  const fetchSuggestions = useCallback(async (field: PersonField, value: string) => {
    if (value.length > 1) {
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
        }
        setSuggestions((prev) => ({ ...prev, [field]: response.data }))
      } catch (error) {
        console.error(`Error fetching ${field} suggestions:`, error)
      }
    } else {
      setSuggestions((prev) => ({ ...prev, [field]: [] }))
    }
  }, [])

  const handleInputChange = (field: PersonField, value: string) => {
    setPerson((prev) => ({ ...prev, [field]: value }))
    fetchSuggestions(field, value)
  }

  const handleSuggestionClick = (field: PersonField, value: string) => {
    setPerson((prev) => ({ ...prev, [field]: value }))
    setSuggestions((prev) => ({ ...prev, [field]: [] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving person:", person)
  }

  const renderInput = (field: PersonField, label: string) => (
      <div className="relative">
        <Input
            placeholder={`Введите ${label}`}
            value={person[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full"
        />
        {suggestions[field].length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
              {suggestions[field].map((suggestion: string, index: number) => (
                  <li
                      key={index}
                      className={cn(
                          "px-4 py-2 hover:bg-gray-100 cursor-pointer",
                          person[field] === suggestion && "bg-gray-100",
                      )}
                      onClick={() => handleSuggestionClick(field, suggestion)}
                  >
                    {suggestion}
                  </li>
              ))}
            </ul>
        )}
      </div>
  )

  return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserPlus className="mr-2" />
            Добавить нового человека
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {renderInput("firstName", "имя")}
            {renderInput("lastName", "фамилию")}
            {renderInput("middleName", "отчество")}
            <Button type="submit" className="w-full">
              Добавить человека
            </Button>
          </form>
        </CardContent>
      </Card>
  )
}

