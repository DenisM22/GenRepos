import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "GenRepos - Хранение генеалогических данных",
  description: "Сервис для хранения и организации генеалогических данных и семейной истории"
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="ru">
      <body className={inter.className}>
      {children}
      <Toaster />
      </body>
      </html>
  )
}
