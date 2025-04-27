import axios from "axios"
import type {User} from "@/app/types/models"

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://genrepos-backend.onrender.com"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,

})

export const userApi = {
    login: (user: any) => api.post(`/user/login`, user, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
    }),
    logout: () => api.post(`user/logout`),
    register: (user: User) => api.post(`/user/register`, user, {
        headers: {"Content-Type": "application/json"},
    }),
    edit: (user: User | null) => api.post(`/user/edit`, user, {
        headers: {"Content-Type": "application/json"},
    }),
    getCurrentUser:() => api.get(`/user/me`),
}

export const personApi = {
    getAll: (str?: string, gender?: string | null, uyezdId?: string | null, from?: string | null, to?: string | null) => api.get(`/person/get-all`, {
        params: {
            str,
            gender,
            uyezdId,
            from,
            to
        }
    }),
    getById: (id: string | string[]) => api.get(`/person/get/${id}`),
    save: (person: any, me: string | null) =>
        api.post("/person/save", person, {
            params : { me },
            headers: {"Content-Type": "application/json"},
        }),
    edit: (id: string | string[], person: any) =>
        api.patch(`/person/edit/${id}`, person, {
            headers: {"Content-Type": "application/json"},
        }),
    delete: (id: string | string[]) => api.delete(`person/delete/${id}`),
    getFamilyTree: (id: string | string[]) => api.get(`/person/family-tree/${id}`),
    getGedcom: (id: string | string[]) => api.get(`/person/family-tree/gedcom/${id}`),
}

export const metricDocumentApi = {
    getAll: (str?: string, from?: string, to?: string, page = 0) => api.get(`/document/metric/get-all`, {
        params: {
            str,
            page,
            from,
            to
        }
    }),
    getById: (id: string | string[]) => api.get(`/document/metric/get/${id}`),
    save: (document: any) =>
        api.post("/document/metric/save", document, {
            headers: {"Content-Type": "application/json"},
        }),
}

export const confessionalDocumentApi = {
    getAll: (str?: string, from?: string, to?: string, page = 0) => api.get(`/document/confessional/get-all`, {
        params: {
            str,
            page,
            from,
            to
        }
    }),
    getById: (id: string | string[]) => api.get(`/document/confessional/get/${id}`),
    save: (document: any) =>
        api.post("/document/confessional/save", document, {
            headers: {"Content-Type": "application/json"},
        }),
}

export const revisionDocumentApi = {
    getAll: (str?: string, from?: string, to?: string, page = 0) => api.get(`/document/revision/get-all`, {
        params: {
            str,
            page,
            from,
            to
        }
    }),
    getById: (id: string | string[]) => api.get(`/document/revision/get/${id}`),
    save: (document: any) =>
        api.post("/document/revision/save", document, {
            headers: {"Content-Type": "application/json"},
        }),
}

export const autocompleteApi = {
    getFirstNames: (str: string) => api.get(`/autocomplete/first-names`, {params: {str}}),
    getLastNames: (str: string) => api.get(`/autocomplete/last-names`, {params: {str}}),
    getMiddleNames: (str: string) => api.get(`/autocomplete/middle-names`, {params: {str}}),
    getUyezdy: () => api.get(`/autocomplete/uyezdy`),
    getVolosts: (uyezdId: number) => api.get(`/autocomplete/volosts`, {params: {uyezdId}}),
    getPlaces: (volostId: number) => api.get(`/autocomplete/places`, {params: {volostId}}),
    getParishes: (str: string) => api.get(`/autocomplete/parishes`, {params: {str}}),
    getFamilyStatuses: () => api.get(`/autocomplete/family-statuses`),
    getSocialStatuses: () => api.get(`/autocomplete/social-statuses`),
    getLandowners: (str: string) => api.get(`/autocomplete/landowners`, {params: {str}}),
}
