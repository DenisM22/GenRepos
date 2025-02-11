import PersonSearch from "../components/PersonSearch"
import AddPersonForm from "../components/AddPersonForm"

export default function People() {
  return (
    <div className="space-y-12 py-8">
      <h1 className="text-4xl font-bold text-center text-primary">Люди</h1>
      <PersonSearch />
      <AddPersonForm />
    </div>
  )
}

