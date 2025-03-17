"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, MapPin, Users, Heart, Baby, UserCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Person } from "@/app/types/models"
import {personApi} from "@/app/api/api";
import {AxiosError} from "axios";

export default function PersonPage() {
  const params = useParams()
  const [message, setMessage] = useState('')
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)

  const fetchPerson = async () => {
    try {
      const response = await personApi.getById(params.id)
      setPerson(response.data)
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        setMessage('Ошибка при загрузке человека: ' + (error.response?.data?.message || error.message));
      } else {
        console.error(error);
        setMessage('Неизвестная ошибка');
      }
    }
  };

  useEffect(() => {
    fetchPerson()
  }, [params.id])

  if (!person) {
    return <div>Загрузка...</div>
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <User className="h-8 w-8 text-primary" />
                {person.lastName} {person.firstName} {person.middleName}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                <span>
                <strong>Пол:</strong> {person.gender === "MALE" ? "Мужской" : "Женский"}
              </span>
              </div>
              {person.birthDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                  <strong>Дата рождения:</strong> {person.birthDate?.exactDate}
                </span>
                  </div>
              )}
              {person.place?.place && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>
                  <strong>Место рождения:</strong> {person.place.place}
                </span>
                  </div>
              )}
              {person.deathDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                  <strong>Дата смерти:</strong> {person.deathDate.exactDate}
                </span>
                  </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Ближайшие родственники
            </h2>

            <Card>
              <CardContent className="p-6">
                <FamilyTree person={person} />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => router.push("/family-tree")} className="gap-2">
              <Users className="h-4 w-4" />
              Полное семейное древо
            </Button>
          </div>
        </main>
      </div>
  )
}

interface FamilyTreeProps {
  person: Person
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ person }) => {
  // Определяем, сколько у нас родственников и какой размер нужен для дерева
  const hasParents = person.father || person.mother
  const hasSpouse = !!person.spouse
  const childrenCount = person.children?.length || 0

  // Рассчитываем размеры дерева
  const treeHeight = hasParents ? 500 : 400
  const minWidth = Math.max(
      hasParents ? 400 : 200,
      hasSpouse ? 400 : 200,
      childrenCount > 0 ? childrenCount * 180 : 200,
  )

  return (
      <div className="w-full overflow-auto">
        <div className="relative mx-auto" style={{ height: `${treeHeight}px`, minWidth: `${minWidth}px` }}>
          {/* Центральная персона */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <PersonNode person={person} type="self" className="bg-primary/10 border-primary" />
          </div>

          {/* Родители */}
          {hasParents && (
              <>
                {/* Линия вверх к родителям */}
                <div className="absolute left-1/2 top-[calc(50%-47px)] w-0.5 h-[32px] bg-gray-300 transform -translate-x-1/2 -translate-y-full"></div>

                {/* Горизонтальная линия между родителями */}
                {person.father && person.mother && (
                    <div className="absolute left-1/2 top-[calc(50%-80px)] w-[242px] h-0.5 bg-gray-300 transform -translate-x-1/2"></div>
                )}

                {/* Отец */}
                {person.father && (
                    <>
                      <div className="absolute left-[calc(50%-120px)] top-[calc(50%-160px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"></div>
                      <div className="absolute left-[calc(50%-120px)] top-[calc(50%-180px)] transform -translate-x-1/2">
                        <PersonNode person={person.father} type="father" href={`/people/${person.father.id}`} />
                      </div>
                    </>
                )}

                {/* Мать */}
                {person.mother && (
                    <>
                      {/* Если есть только мать, центрируем её */}
                      <div
                          className="absolute top-[calc(50%-160px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"
                          style={{
                            left: person.father ? "calc(50% + 120px)" : "50%",
                          }}
                      ></div>
                      <div
                          className="absolute top-[calc(50%-180px)] transform -translate-x-1/2"
                          style={{
                            left: person.father ? "calc(50% + 120px)" : "50%",
                          }}
                      >
                        <PersonNode person={person.mother} type="mother" href={`/people/${person.mother.id}`} />
                      </div>
                    </>
                )}
              </>
          )}

          {/* Супруг(а) */}
          {hasSpouse && (
              <>
                {/* Горизонтальная линия к супругу */}
                <div className="absolute left-[calc(50%+80px)] top-1/2 w-[100px] h-0.5 bg-gray-300 transform -translate-y-1/2"></div>

                <div className="absolute left-[calc(50%+220px)] top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <PersonNode person={person.spouse!} type="spouse" href={`/people/${person.spouse!.id}`} />
                </div>
              </>
          )}

          {/* Дети */}
          {childrenCount > 0 && (
              <>
                {/* Линия вниз к детям */}
                <div className="absolute left-1/2 top-1/2 w-0.5 h-[92px] bg-gray-300 transform -translate-x-1/2 translate-y-1/2"></div>

                {/* Горизонтальная линия между детьми */}
                {childrenCount > 1 && (
                    <div
                        className="absolute left-1/2 top-[calc(50%+80px)] bg-gray-300 transform -translate-x-1/2"
                        style={{
                          width: `${(childrenCount - 1) * 180}px`,
                          height: "2px",
                        }}
                    ></div>
                )}

                {/* Отображение детей */}
                {person.children?.map((child, index) => {
                  const totalWidth = (childrenCount - 1) * 180
                  const startX = -totalWidth / 2
                  const childX = startX + index * 180

                  return (
                      <div key={child.id}>
                        {/* Вертикальная линия к ребенку */}
                        <div
                            className="absolute top-[calc(50%+80px)] w-0.5 h-[80px] bg-gray-300 transform -translate-x-1/2"
                            style={{ left: `calc(50% + ${childX}px)` }}
                        ></div>

                        {/* Ребенок */}
                        <div
                            className="absolute transform -translate-x-1/2"
                            style={{
                              left: `calc(50% + ${childX}px)`,
                              top: "calc(50% + 160px)",
                            }}
                        >
                          <PersonNode person={child} type="child" href={`/people/${child.id}`} />
                        </div>
                      </div>
                  )
                })}
              </>
          )}
        </div>
      </div>
  )
}

interface PersonNodeProps {
  person: Partial<Person>
  type: "self" | "father" | "mother" | "spouse" | "child"
  href?: string
  className?: string
}

const PersonNode: React.FC<PersonNodeProps> = ({ person, type, href, className = "" }) => {
  const getIcon = () => {
    switch (type) {
      case "father":
        return <User className="h-4 w-4" />
      case "mother":
        return <User className="h-4 w-4" />
      case "spouse":
        return <Heart className="h-4 w-4" />
      case "child":
        return <Baby className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRelationLabel = () => {
    switch (type) {
      case "father":
        return "Отец"
      case "mother":
        return "Мать"
      case "spouse":
        return person.gender === "MALE" ? "Муж" : "Жена"
      case "child":
        return person.gender === "MALE" ? "Сын" : "Дочь"
      default:
        return ""
    }
  }

  const content = (
      <div className={`w-[160px] p-3 rounded-lg border ${className || "bg-card hover:bg-card/80"} transition-colors`}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">{getIcon()}</div>
          {type !== "self" && <span className="text-xs font-medium">{getRelationLabel()}</span>}
        </div>
        <div className="text-sm font-medium">
          {person.lastName} {person.firstName}
        </div>
        {person.birthDate && (
            <div className="text-xs text-muted-foreground mt-1">
              {person.birthDate.year && `${person.birthDate.year} г.`}
            </div>
        )}
      </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
