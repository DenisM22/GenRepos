import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api = axios.create({
  baseURL: API_URL,
})

export const metricDocumentApi = {
  getAll: (str?: string, from?: number, to?: number, page = 0) => api.get(`/document/metric/get-all`, { params: { str, page, from, to } }),
  getById: (id: string | string[]) => api.get(`/document/metric/get/${id}`),
  save: (document: any) =>
    api.post("/document/metric/save", document, {
      headers: { "Content-Type": "application/json" },
    }),
}

export const confessionalDocumentApi = {
  getAll: (str?: string, from?: number, to?: number, page = 0) => api.get(`/document/confessional/get-all`, { params: { str, page, from, to } }),
  getById: (id: string | string[]) => api.get(`/document/confessional/get/${id}`),
  save: (document: any) =>
      api.post("/document/confessional/save", document, {
        headers: { "Content-Type": "application/json" },
      }),
}

export const revisionDocumentApi = {
  getAll: (str?: string, from?: number, to?: number, page = 0) => api.get(`/document/revision/get-all`, { params: { str, page, from, to } }),
  getById: (id: string | string[]) => api.get(`/document/revision/get/${id}`),
  save: (document: any) =>
      api.post("/document/revision/save", document, {
        headers: { "Content-Type": "application/json" },
      }),
}

export const personApi = {
  getAll: (str?: string, uyezdId?: number, from?: number, to?: number, page = 0) => api.get(`/person/get-all`, { params: { str, page, uyezdId, from, to } }),
  getById: (id: string | string[]) => api.get(`/person/get/${id}`),
  save: (person: any) =>
    api.post("/person/save", person, {
      headers: { "Content-Type": "application/json" },
    }),
}

export const autocompleteApi = {
    getFirstNames: (str: string) => api.get(`/autocomplete/first-names`, { params: { str } }),
    getLastNames: (str: string) => api.get(`/autocomplete/last-names`, { params: { str } }),
    getMiddleNames: (str: string) => api.get(`/autocomplete/middle-names`, { params: { str } }),
    getUyezdy: () => api.get(`/autocomplete/uyezdy`),
    getVolosts: (uyezdId: number) => api.get(`/autocomplete/volosts`, { params: { uyezdId } }),
    getPlaces: (volostId: number) => api.get(`/autocomplete/places`, { params: { volostId } }),
    getParishes: (str: string) => api.get(`/autocomplete/parishes`, {params: {str} }),
    getFamilyStatuses: () => api.get(`/autocomplete/family-statuses`),
    getSocialStatuses: () => api.get(`/autocomplete/social-statuses`),
    getLandowners: (str: string) => api.get(`/autocomplete/landowners`, {params: {str} }),
}
