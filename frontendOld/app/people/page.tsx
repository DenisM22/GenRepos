import PersonSearch from "../components/PersonSearch"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function People() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Люди</h1>
                <Link href="/people/new">
                    <Button>Добавить человека</Button>
                </Link>
            </div>
            <PersonSearch />
        </div>
    )
}

