import DocumentSearch from "../components/DocumentSearch"
import AddDocumentForm from "../components/AddDocumentForm"

export default function Documents() {
  return (
    <div className="space-y-12 py-8">
      <h1 className="text-4xl font-bold text-center text-primary">Документы</h1>
      <DocumentSearch />
      <AddDocumentForm />
    </div>
  )
}

