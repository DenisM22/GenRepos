import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, FileText, Users, BookOpen, Search, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Image from "next/image"

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main>
          <section className="relative overflow-hidden py-20 md:py-32">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Сохраните историю вашей семьи
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
                  Современный сервис для хранения, организации и исследования генеалогических данных и семейной истории.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/documents/new">
                    <Button size="lg" className="gap-2 text-base h-12 px-6 group">
                      Добавить документ
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button variant="outline" size="lg" className="gap-2 text-base h-12 px-6">
                      Узнать больше
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background z-10"></div>
              <Image
                  src="/placeholder.svg?height=800&width=800"
                  alt="Генеалогическое древо"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности сервиса</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Все необходимые инструменты для исследования и сохранения вашей семейной истории
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group relative bg-card hover:bg-card/80 transition-colors p-8 rounded-2xl border shadow-sm hover:shadow-md">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 rounded-full bg-primary/10 mb-6 inline-block">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Документы</h3>
                  <p className="text-muted-foreground mb-6">
                    Добавляйте и систематизируйте исторические документы, свидетельства и архивные материалы вашей семьи
                  </p>
                  <Link href="/documents" className="inline-flex items-center text-primary font-medium">
                    Подробнее <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                  </Link>
                </div>
                <div className="group relative bg-card hover:bg-card/80 transition-colors p-8 rounded-2xl border shadow-sm hover:shadow-md">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 rounded-full bg-primary/10 mb-6 inline-block">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Люди</h3>
                  <p className="text-muted-foreground mb-6">
                    Создавайте профили предков с биографиями, фотографиями и связями между родственниками
                  </p>
                  <Link href="/people" className="inline-flex items-center text-primary font-medium">
                    Подробнее <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                  </Link>
                </div>
                <div className="group relative bg-card hover:bg-card/80 transition-colors p-8 rounded-2xl border shadow-sm hover:shadow-md">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-4 rounded-full bg-primary/10 mb-6 inline-block">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Родословная</h3>
                  <p className="text-muted-foreground mb-6">
                    Визуализируйте семейное древо, отслеживайте родственные связи и исследуйте свою родословную
                  </p>
                  <Link href="/family-tree" className="inline-flex items-center text-primary font-medium">
                    Подробнее <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Начните исследование</h2>
                  </div>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Создайте свой первый документ и начните сохранять историю вашей семьи для будущих поколений.
                  </p>
                  <Link href="/documents/new">
                    <Button size="lg" className="gap-2 text-base h-12 px-6 group">
                      Добавить документ
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">ГР</span>
                </div>
                <span className="font-bold">ГенРепозиторий</span>
              </div>
              <div className="flex gap-8">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Условия использования
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Контакты
                </Link>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ГенРепозиторий. Все права защищены.
            </div>
          </div>
        </footer>
      </div>
  )
}
