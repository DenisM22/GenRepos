"use client"

import { motion } from "framer-motion"
import { FileText, Users, BookOpen, Search, Award, Shield } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExplorePage() {
    const features = [
        {
            icon: FileText,
            title: "Управление документами",
            description: "Загружайте, организуйте и храните важные семейные документы в одном безопасном месте.",
        },
        {
            icon: Users,
            title: "Создание профилей",
            description: "Создавайте подробные профили для каждого члена семьи, включая биографии и фотографии.",
        },
        {
            icon: BookOpen,
            title: "Построение родословной",
            description: "Визуализируйте свое семейное древо и исследуйте связи между поколениями.",
        },
        {
            icon: Search,
            title: "Расширенный поиск",
            description: "Быстро находите нужную информацию с помощью мощных инструментов поиска и фильтрации.",
        },
        {
            icon: Award,
            title: "Сохранение наследия",
            description: "Передавайте семейные истории и традиции будущим поколениям в цифровом формате.",
        },
        {
            icon: Shield,
            title: "Безопасность данных",
            description: "Ваши семейные данные защищены с использованием современных технологий шифрования.",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Узнайте больше о ГенРепозитории
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
                        ГенРепозиторий - это современный сервис для хранения, организации и исследования генеалогических данных и
                        семейной истории. Откройте для себя мощные инструменты для сохранения вашего семейного наследия.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <feature.icon className="h-12 w-12 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-4">Как начать работу с ГенРепозиторием</h2>
                        <ol className="list-decimal list-inside space-y-4 text-lg">
                            <li>Зарегистрируйтесь на платформе, создав личный аккаунт.</li>
                            <li>Начните с добавления основной информации о вашей семье.</li>
                            <li>Загрузите важные документы и фотографии.</li>
                            <li>Создайте профили для членов семьи и установите связи между ними.</li>
                            <li>Исследуйте свое семейное древо и делитесь историями с родственниками.</li>
                        </ol>
                    </section>

                    <section className="bg-primary/5 p-8 rounded-lg mb-12">
                        <h2 className="text-3xl font-bold mb-4">Почему выбирают ГенРепозиторий</h2>
                        <ul className="list-disc list-inside space-y-2 text-lg">
                            <li>Интуитивно понятный интерфейс, доступный для пользователей любого уровня.</li>
                            <li>Надежное хранение данных с регулярным резервным копированием.</li>
                            <li>Возможность совместной работы с членами семьи над общей родословной.</li>
                            <li>Постоянные обновления и добавление новых функций.</li>
                            <li>Поддержка различных форматов документов и медиафайлов.</li>
                        </ul>
                    </section>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Готовы начать свое генеалогическое путешествие?</h2>
                        <Link href="/register">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Зарегистрироваться бесплатно
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

