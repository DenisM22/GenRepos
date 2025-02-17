import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api = axios.create({
  baseURL: API_URL,
})

export const documentApi = {
  getAll: (str?: string, page = 0) => api.get(`/document/get-all`, { params: { str, page } }),
  getById: (id: number) => api.get(`/document/get/${id}`),
  save: (document: any) =>
    api.post("/document/save", document, {
      headers: { "Content-Type": "application/json" },
    }),
}

export const personApi = {
  getAll: (str?: string, page = 0) => api.get(`/person/get-all`, { params: { str, page } }),
  getById: (id: number) => api.get(`/person/get/${id}`),
  save: (person: any) =>
    api.post("/person/save", person, {
      headers: { "Content-Type": "application/json" },
    }),
}

export const autocompleteApi = {
  getFirstNames: (str: string) => api.get(`/autocomplete/first-names`, { params: { str } }),
  getLastNames: (str: string) => api.get(`/autocomplete/last-names`, { params: { str } }),
  getMiddleNames: (str: string) => api.get(`/autocomplete/middle-names`, { params: { str } }),
  getPlaces: (str: string) => api.get(`/autocomplete/places`, { params: { str } })
}
