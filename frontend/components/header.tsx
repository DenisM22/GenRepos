"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, FileText, Users, BookOpen, LogIn, UserPlus } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">ГР</span>
              </div>
              <span className="hidden font-bold sm:inline-block">ГенРепозиторий</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
                href="/documents"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Документы
            </Link>
            <Link
                href="/people"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Люди
            </Link>
            <Link
                href="/family-tree"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Родословная
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Поиск</span>
            </Button>

            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Регистрация
                </Button>
              </Link>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                  <FileText className="h-4 w-4" />
                  Документы
                </Link>
                <Link
                    href="/people"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  Люди
                </Link>
                <Link
                    href="/family-tree"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4" />
                  Родословная
                </Link>
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Войти
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Регистрация
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
        )}
      </header>
  )
}
