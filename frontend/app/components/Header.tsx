"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  return (
      <header className="bg-primary text-primary-foreground shadow-md">
        <nav className="container mx-auto p-4">
          <ul className="flex space-x-6 justify-center">
            <li>
              <Link
                  href="/"
                  className={`fancy-underline text-lg font-medium ${pathname === "/" ? "text-accent-foreground" : ""}`}
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                  href="/documents"
                  className={`fancy-underline text-lg font-medium ${pathname === "/documents" ? "text-accent-foreground" : ""}`}
              >
                Документы
              </Link>
            </li>
            <li>
              <Link
                  href="/people"
                  className={`fancy-underline text-lg font-medium ${pathname === "/people" ? "text-accent-foreground" : ""}`}
              >
                Люди
              </Link>
            </li>
          </ul>
        </nav>
      </header>
  )
}

