"use client"

import React, {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {toast} from "@/components/ui/use-toast"
import {BookOpen, FileText, History, IdCard, LogOut, Settings, Usb, UserPen, Users} from "lucide-react"
import useUserData from "@/components/useUserData";
import Header from "@/components/header"
import {userApi} from "@/app/api/api";
import {AxiosError} from "axios";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useRouter} from "next/navigation";
import {User} from "@/app/types/models";
import Link from "next/link";

export default function ProfilePage() {
    const user = useUserData()
    const [editedUser, setEditedUser] = useState<User | null>(null)
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("settings")
    const [logoutDialog, setLogoutDialog] = useState(false)

    useEffect(() => {
        if (user) {
            setEditedUser(user);
        }
    }, [user])

    const handleSaveProfile = async () => {
        try {
            await userApi.edit(editedUser)
            sessionStorage.removeItem('user')

            console.log("Профиль обновлен");
            toast({
                title: "Профиль обновлен",
                description: "Ваши изменения были успешно сохранены",
                variant: "success",
            })

        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Ошибка при сохранении человека:", error.response);
                toast({
                    title: "Ошибка при сохранении человека",
                    description: `${error?.response?.data}`,
                    variant: "destructive",
                })
            } else {
                console.error("Неизвестная ошибка:", error);
                toast({
                    title: "Неизвестная ошибка",
                    variant: "destructive",
                })
            }
        }
    }

    const handleChange = (key: keyof User, e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser((prev) => ({
            ...prev!,
            [key]: e.target.value,
        }));
    }

    const handleLogout = async () => {
        try {
            await userApi.logout()
            toast({
                title: "Вы вышли из системы",
                variant: "default",
            })
            router.push('/')

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                toast({
                    title: "Ошибка при выходе из системы",
                    description: `${error.response?.data}`,
                    variant: "destructive",
                })
            } else {
                console.error(error);
                toast({
                    title: "Неизвестная ошибка",
                    variant: "destructive",
                })
            }

        } finally {
            sessionStorage.removeItem('user')
            setLogoutDialog(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <div className="container py-10">
                <h1 className="text-3xl font-bold mb-6">Профиль пользователя</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Боковая панель */}
                    <Card className="md:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4 mb-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/tree.png" alt="Фото профиля"/>
                                </Avatar>
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold">{user?.username}</h2>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    variant={activeTab === "settings" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("settings")}
                                >
                                    <Settings className="mr-2 h-4 w-4"/>
                                    Настройки
                                </Button>
                                <Button
                                    variant={activeTab === "activity" ? "default" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setActiveTab("activity")}
                                >
                                    <History className="mr-2 h-4 w-4"/>
                                    Активность
                                </Button>

                                <div className="pt-4 mt-4 border-t">
                                    <Button variant="destructive"
                                            className="w-full"
                                            onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        Выйти
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Основное содержимое */}
                    <div className="md:col-span-3">
                        {activeTab === "settings" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Информация профиля</CardTitle>
                                    <CardDescription>Ваша личная информация и контактные данные</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Имя пользователя</Label>
                                        <Input
                                            id="lastName"
                                            value={editedUser?.username || ""}
                                            onChange={(e) => handleChange("username", e)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={editedUser?.email || ""}
                                            onChange={(e) => handleChange("email", e)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Новый пароль</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            onChange={(e) => handleChange("password", e)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <Button onClick={handleSaveProfile} className="gap-2">
                                        Сохранить изменения
                                    </Button>
                                    <Link
                                        href={user?.person ? (`/people/${user?.person?.id}`) : (`/people/new?me=true`)}
                                        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                                    >
                                        Моя карточка
                                    </Link>
                                </CardFooter>

                            </Card>
                        )}

                        {activeTab === "activity" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Активность</CardTitle>
                                    <CardDescription>Ваша недавняя активность в системе.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4 border-b pb-4">
                                            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                                            <div>
                                                <p className="font-medium">Добавлен новый документ</p>
                                                <p className="text-sm text-muted-foreground">Метрическая книга, 1892
                                                    год</p>
                                                <p className="text-xs text-muted-foreground">2 дня назад</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 border-b pb-4">
                                            <Users className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                                            <div>
                                                <p className="font-medium">Добавлена новая персона</p>
                                                <p className="text-sm text-muted-foreground">Петров Николай Иванович</p>
                                                <p className="text-xs text-muted-foreground">5 дней назад</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <BookOpen className="h-5 w-5 mt-0.5 text-muted-foreground"/>
                                            <div>
                                                <p className="font-medium">Обновлено родословное древо</p>
                                                <p className="text-sm text-muted-foreground">Добавлены новые связи</p>
                                                <p className="text-xs text-muted-foreground">1 неделю назад</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Вы уверены, что хотите выйти из системы?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setLogoutDialog(false)}>
                            Отмена
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

