import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-8 text-center">
      <h1 className="text-5xl font-bold text-primary">Добро пожаловать в Генеалогический сервис</h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Исследуйте свою семейную историю, открывайте новые связи и сохраняйте важные документы с помощью нашего
        инновационного сервиса.
      </p>
      <div className="flex space-x-4">
        <Link href="/documents">
          <Button size="lg" className="text-lg">
            Изучить документы
          </Button>
        </Link>
        <Link href="/people">
          <Button size="lg" variant="outline" className="text-lg">
            Найти людей
          </Button>
        </Link>
      </div>
    </div>
  )
}

