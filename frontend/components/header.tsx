"use client"

import Link from "next/link"
import {Button} from "@/components/ui/button"
import {BookOpen, FileText, LogIn, Menu, Search, User, UserPlus, Users, X} from "lucide-react"
import React, {useState} from "react"
import useUserData from "@/components/useUserData";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {userApi} from "@/app/api/api";
import {AxiosError} from "axios";
import {toast} from "@/components/ui/use-toast";
import {usePathname, useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [logoutDialog, setLogoutDialog] = useState(false)
    const user = useUserData()
    const pathname = usePathname()

    const handleLogout = async () => {
        try {
            await userApi.logout()
            toast({
                title: "Вы вышли из системы",
                variant: "default",
            })

            console.log(user)

            if (pathname === '/')
                window.location.reload()
            else
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
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">GR</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block">GenRepos</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/documents"
                        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4"/>
                        Документы
                    </Link>
                    <Link
                        href="/people"
                        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                    >
                        <Users className="h-4 w-4"/>
                        Люди
                    </Link>
                    <Link
                        href={user?.person ? (`/family-tree/${user?.person?.id}`) : (`/family-tree/new`)}
                        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                    >
                        <img src="/tree-icon.png" alt="Tree Icon" className="h-4 w-4"/>
                        Родословная
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="hidden md:flex gap-2">
                            <Link href="/profile">
                                <Button className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Профиль
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2"
                                onClick={() => setLogoutDialog(true)}
                            >
                                <LogIn className="h-4 w-4"/>
                                Выйти
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4"/>
                                    Войти
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4"/>
                                    Регистрация
                                </Button>
                            </Link>
                        </div>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                        <span className="sr-only">Меню</span>
                    </Button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="container md:hidden py-4 pb-6">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/documents"
                            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <FileText className="h-4 w-4"/>
                            Документы
                        </Link>
                        <Link
                            href="/people"
                            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Users className="h-4 w-4"/>
                            Люди
                        </Link>
                        <Link
                            href={user?.person ? (`/family-tree/${user?.person?.id}`) : (`/family-tree/new`)}
                            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <img src="/tree-icon.png" alt="Tree Icon" className="h-4 w-4"/>
                            Родословная
                        </Link>
                        {user ? (
                            <div className="flex flex-col gap-2 mt-2">
                                <Link href="/profile">
                                    <Button className="w-full justify-start">
                                        <User className="h-4 w-4" />
                                        Профиль
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => setLogoutDialog(true)}
                                >
                                    <LogIn className="h-4 w-4"/>
                                    Выйти
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 mt-2">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <LogIn className="h-4 w-4 mr-2"/>
                                        Войти
                                    </Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full justify-start">
                                        <UserPlus className="h-4 w-4 mr-2"/>
                                        Регистрация
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}

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

        </header>
    )
}
