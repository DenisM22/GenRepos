import AddDocumentForm from "@/app/components/AddDocumentForm"

export default function NewDocument() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Создать новый документ</h1>
            <AddDocumentForm />
        </div>
    )
}

