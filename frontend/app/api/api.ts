import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api = axios.create({
  baseURL: API_URL,
})

export const metricDocumentApi = {
  getAll: (str?: string, page = 0) => api.get(`/metric-document/get-all`, { params: { str, page } }),
  getById: (id: number) => api.get(`/metric-document/get/${id}`),
  save: (document: any) =>
    api.post("/metric-document/save", document, {
      headers: { "Content-Type": "application/json" },
    }),
}

export const confessionalDocumentApi = {
  getAll: (str?: string, page = 0) => api.get(`/confessional-document/get-all`, { params: { str, page } }),
  getById: (id: number) => api.get(`/confessional-document/get/${id}`),
  save: (document: any) =>
      api.post("/confessional-document/save", document, {
        headers: { "Content-Type": "application/json" },
      }),
}

export const revisionDocumentApi = {
  getAll: (str?: string, page = 0) => api.get(`/revision-document/get-all`, { params: { str, page } }),
  getById: (id: number) => api.get(`/revision-document/get/${id}`),
  save: (document: any) =>
      api.post("/revision-document/save", document, {
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
    getUyezdy: () => api.get(`/autocomplete/uyezdy`),
    getVolosts: (uyezdId: number) => api.get(`/autocomplete/volosts`, { params: { uyezdId } }),
    getPlaces: (volostId: number) => api.get(`/autocomplete/places`, { params: { volostId } }),
    getParishes: (str: string) => api.get(`/autocomplete/parishes`, {params: {str} }),
    getFamilyStatuses: () => api.get(`/autocomplete/family-statuses`),
    getSocialStatuses: () => api.get(`/autocomplete/social-statuses`),
    getLandowners: (str: string) => api.get(`/autocomplete/landowners`, {params: {str} }),
}
