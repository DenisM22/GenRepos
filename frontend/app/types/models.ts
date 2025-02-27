export interface Parish {
  id?: number
  parish?: string
}

export interface Uyezd {
  id?: number
  uyezd?: string
}

export interface Volost {
  id?: number
  volost?: string
  uyezd?: Uyezd | null
}

export interface Place {
  id?: number
  place?: string
  volost?: Volost | null
}

export interface Landowner {
  id?: number
  landowner?: string
  place?: Place | null
}

export interface FamilyStatus {
  id?: number
  familyStatus?: string
}

export interface SocialStatus {
  id?: number
  socialStatus?: string
}

export interface FuzzyDate {
  id?: number
  exactDate?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface Person {
  id?: number
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE"
  birthDate?: FuzzyDate
  deathDate?: FuzzyDate
  uyezd?: Uyezd | null
  volost?: Volost | null
  place?: Place | null
  socialStatus?: SocialStatus | null
  spouse?: Person
  father?: Person
  mother?: Person
  children?: Person[]
}

export interface ConfessionalDocument {
  id?: number
  title?: string
  createdAt?: number
  parish?: Parish | null
  image?: string | null
  people?: PersonFromConfessionalDocument[] | null
}

export interface PersonFromConfessionalDocument {
  id?: number
  document?: ConfessionalDocument | null
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE"
  birthDate?: FuzzyDate | null
  deathDate?: FuzzyDate | null
  place?: Place | null
  household?: string
  landowner?: Landowner | null
  familyStatus?: FamilyStatus | null
  socialStatus?: SocialStatus | null
}

export interface RevisionDocument {
  id?: number
  title?: string
  createdAt?: number
  place?: Place | null
  image?: string | null
  people?: PersonFromRevisionDocument[] | null
}

export interface PersonFromRevisionDocument {
  id?: number
  document?: RevisionDocument | null
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE"
  previousAge?: number
  currentAge?: number
  household?: string
  landowner?: Landowner | null
  familyStatus?: FamilyStatus | null
  socialStatus?: SocialStatus | null
  departureYear?: number
  departureReason?: string
  marriagePlace?: Place | null
  marriageDocument?: boolean
}

export interface MetricDocument {
  id?: number
  title?: string
  createdAt?: number
  parish?: Parish | null
  image?: string | null
  birthRecords?: BirthRecord[] | null
  deathRecords?: DeathRecord[] | null
  marriageRecords?: MarriageRecord[] | null
}

export interface BirthRecord {
  id?: number
  document?: MetricDocument
  newbornName?: string
  birthDate?: FuzzyDate
  place?: Place
  landowner?: Landowner
  familyStatus?: FamilyStatus

  fatherFirstName?: string
  fatherLastName?: string
  fatherMiddleName?: string
  fatherSocialStatus?: SocialStatus
  fatherIsDead?: boolean

  motherFirstName?: string
  motherMiddleName?: string
  motherFamilyStatus?: FamilyStatus

  godparentFirstName?: string
  godparentLastName?: string
  godparentMiddleName?: string
  godparentPlace?: Place
  godparentFamilyStatus?: FamilyStatus
  godparentSocialStatus?: SocialStatus
}

export interface DeathRecord {
  id?: number
  document?: MetricDocument
  firstName?: string
  lastName?: string
  middleName?: string
  age?: number
  deathDate?: FuzzyDate
  place?: Place
  familyStatus?: FamilyStatus
  socialStatus?: SocialStatus
  deathCause?: string
  burialPlace?: Place
}

export interface MarriageRecord {
  id?: number
  document?: MetricDocument
  marriageDate?: FuzzyDate

  groomFirstName?: string
  groomLastName?: string
  groomMiddleName?: string
  groomAge?: number
  groomPlace?: Place
  groomLandowner?: Landowner
  groomSocialStatus?: SocialStatus
  groomMarriageNumber?: number

  groomFatherFirstName?: string
  groomFatherLastName?: string
  groomFatherMiddleName?: string
  groomFatherSocialStatus?: SocialStatus

  brideFirstName?: string
  brideLastName?: string
  brideMiddleName?: string
  brideAge?: number
  bridePlace?: Place
  brideLandowner?: Landowner
  brideSocialStatus?: SocialStatus
  brideMarriageNumber?: number

  brideFatherFirstName?: string
  brideFatherLastName?: string
  brideFatherMiddleName?: string
  brideFatherSocialStatus?: SocialStatus

  guarantorFirstName?: string
  guarantorLastName?: string
  guarantorMiddleName?: string
  guarantorPlace?: Place
  guarantorRole?: string
  guarantorFamilyStatus?: FamilyStatus
  guarantorSocialStatus?: SocialStatus
}




export interface Record {
  id: string
  number: number
  name: string
  relation: string
  details: string
  uyezd?: Uyezd | null
  volost?: Volost | null
  place?: Place | null
}

export interface Template {
  id: string
  name: string
}

