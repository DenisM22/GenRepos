import AddPersonForm from "@/app/components/AddPersonForm"

export default function NewPerson() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Добавить нового человека</h1>
            <AddPersonForm />
        </div>
    )
}

