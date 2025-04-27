"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, ArrowRight, Info } from "lucide-react"

export default function NewFamilyTreePage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl md:text-3xl flex items-center justify-center gap-2">
                            <Users className="h-8 w-8 text-primary" />
                            Создание родословного древа
                        </CardTitle>
                        <CardDescription className="text-lg">Начните исследование своей родословной</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted/50 p-4 rounded-lg border border-muted flex gap-4">
                            <div className="flex-shrink-0">
                                <Info className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Для начала создайте свою карточку</h3>
                                <p className="text-muted-foreground">
                                    Чтобы построить родословное древо, необходимо сначала создать карточку для себя или центрального
                                    человека в вашем исследовании. После этого вы сможете добавлять родственников и строить связи между
                                    ними.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-card p-4 rounded-lg border shadow-sm">
                                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center bg-primary/10 text-primary w-6 h-6 rounded-full text-sm">
                    1
                  </span>
                                    Создайте свою карточку
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Укажите основную информацию о себе: имя, фамилию, дату рождения и другие данные.
                                </p>
                                <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                                    <UserPlus className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                            </div>

                            <div className="bg-card p-4 rounded-lg border shadow-sm">
                                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center bg-primary/10 text-primary w-6 h-6 rounded-full text-sm">
                    2
                  </span>
                                    Постройте родословное древо
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Добавьте родителей, детей и других родственников, чтобы увидеть свою родословную.
                                </p>
                                <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                                    <Users className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push("/people/new?me=true")}>
                            Создать свою карточку
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                            <Link href="/people">Просмотреть существующие</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}
