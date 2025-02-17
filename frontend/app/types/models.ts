export interface Document {
  id?: number
  title?: string
  yearOfCreation?: number
  parish?: string
  place?: string
  household?: string
  image?: string // Будем использовать base64 строку для изображения
  people?: PersonFromDocument[]
}

export interface PersonFromDocument {
  id?: number
  document?: Document
  firstName?: string
  lastName?: string
  middleName?: string
  birthDate?: FuzzyDate
  deathDate?: FuzzyDate
  socialStatus?: string
  familyStatus?: string
}

export interface Person {
  id?: number
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE" | "OTHER"
  birthDate?: FuzzyDate
  deathDate?: FuzzyDate
  place?: string
  spouse?: Person
  father?: Person
  mother?: Person
  children?: Person[]
}

export interface FuzzyDate {
  id?: number
  exactDate?: string
  startDate?: string
  endDate?: string
  description?: string
}