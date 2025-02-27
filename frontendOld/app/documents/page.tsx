import DocumentSearch from "../components/DocumentSearch"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Documents() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Документы</h1>
                <Link href="/documents/new">
                    <Button>Создать документ</Button>
                </Link>
            </div>
            <DocumentSearch />
        </div>
    )
}

