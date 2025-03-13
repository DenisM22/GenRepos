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

export interface MetricDocument {
  id?: number
  title?: string
  createdAt?: number
  parish?: Parish | null
  birthRecords?: BirthRecord[] | null
  deathRecords?: DeathRecord[] | null
  marriageRecords?: MarriageRecord[] | null
}

export interface ConfessionalDocument {
  id?: number
  title?: string
  createdAt?: number
  parish?: Parish | null
  people?: PersonFromConfessionalDocument[] | null
}

export interface RevisionDocument {
  id?: number
  title?: string
  createdAt?: number
  uyezd?: Uyezd | null
  volost?: Volost | null
  place?: Place | null
  people?: PersonFromRevisionDocument[] | null
}

export interface PersonFromConfessionalDocument {
  id?: number
  idDate?: number
  document?: ConfessionalDocument | null
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE"
  birthDate?: FuzzyDate | null
  deathDate?: FuzzyDate | null
  uyezd?: Uyezd | null
  volost?: Volost | null
  place?: Place | null
  household?: string
  landowner?: Landowner | null
  familyStatus?: FamilyStatus | null
  socialStatus?: SocialStatus | null

  image?: string
  imageDescription?: string
}

export interface PersonFromRevisionDocument {
  id?: number
  idDate?: number
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

  image?: string
  imageDescription?: string

  number?: number
}

export interface BirthRecord {
  id?: number
  idDate?: number
  document?: MetricDocument
  newbornName?: string
  birthDate?: FuzzyDate
  uyezd?: Uyezd | null
  volost?: Volost | null
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
  godparentUyezd?: Uyezd | null
  godparentVolost?: Volost | null
  godparentPlace?: Place
  godparentFamilyStatus?: FamilyStatus
  godparentSocialStatus?: SocialStatus

  image?: string
  imageDescription?: string
}

export interface MarriageRecord {
  id?: number
  idDate?: number
  document?: MetricDocument
  marriageDate?: FuzzyDate

  groomFirstName?: string
  groomLastName?: string
  groomMiddleName?: string
  groomAge?: number
  groomUyezd?: Uyezd
  groomVolost?: Volost
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
  brideUyezd?: Uyezd
  brideVolost?: Volost
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
  guarantorUyezd?: Uyezd
  guarantorVolost?: Volost
  guarantorPlace?: Place
  guarantorRole?: string
  guarantorFamilyStatus?: FamilyStatus
  guarantorSocialStatus?: SocialStatus

  image?: string
  imageDescription?: string
}

export interface DeathRecord {
  id?: number
  idDate?: number
  document?: MetricDocument
  firstName?: string
  lastName?: string
  middleName?: string
  gender?: "MALE" | "FEMALE"
  age?: number
  uyezd?: Uyezd
  volost?: Volost
  place?: Place

  deathDate?: FuzzyDate
  familyStatus?: FamilyStatus
  socialStatus?: SocialStatus
  deathCause?: string
  burialUyezd?: Uyezd
  burialVolost?: Volost
  burialPlace?: Place

  image?: string
  imageDescription?: string
}

export interface Template extends Omit<PersonFromConfessionalDocument, "id" | "number"> {
  id: string
  name: string
}

export interface TemplateRevision extends Omit<PersonFromRevisionDocument, "id" | "number"> {
  id: string
  name: string
}