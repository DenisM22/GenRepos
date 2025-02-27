"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {UserPlus} from "lucide-react"
import {personApi} from "../api/api"
import {usePersonForm} from "@/app/components/ForForms";

export default function AddPersonForm() {
    const [message, setMessage] = useState('')
    const {renderInput, renderGenderInput, renderDateInput, renderUyezdInput, person} = usePersonForm()

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            await personApi.save(person)
            console.log("Человек успешно сохранен")
            setMessage("Человек успешно сохранен")
        } catch (error) {
            console.error("Ошибка при сохранении человека:", error)
        }
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                    <UserPlus className="mr-2"/>
                    Добавить нового человека
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderInput("lastName", "фамилию")}
                    {renderInput("firstName", "имя")}
                    {renderInput("middleName", "отчество")}
                    {renderGenderInput()}
                    {renderDateInput("birthDate", "Дата рождения")}
                    {renderDateInput("deathDate", "Дата смерти")}
                    {renderUyezdInput()}
                    {renderInput("volost", "волость")}
                    {renderInput("place", "место рождения")}
                    {renderInput("spouse", "супругу", true)}
                    {renderInput("father", "отца", true)}
                    {renderInput("mother", "мать", true)}
                    {renderInput("children", "детей", true)}
                    <Button type="submit" className="w-full">
                        Добавить человека
                    </Button>
                </form>
            </CardContent>
            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </Card>
    )
}
