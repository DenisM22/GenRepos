"use client"

import {useRouter, useSearchParams} from "next/navigation"
import Link from "next/link"
import {motion} from "framer-motion"
import {Lock, LogIn, User} from "lucide-react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import Header from "@/components/header"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {toast} from "@/components/ui/use-toast"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {userApi} from "@/app/api/api";
import {AxiosError} from "axios";
import {Suspense, useEffect} from "react"

const loginSchema = z.object({
    username: z.string().nonempty("Имя пользователя не должно быть пустым"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Page() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <LoginPage/>
        </Suspense>
    );
}

function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const forbidden = searchParams.get('forbidden');
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    useEffect(() => {
        if (forbidden === 'true') {
            toast({
                title: 'Вход в систему',
                description: 'Чтобы получить доступ к этой странице необходимо войти в систему',
                variant: 'info',
            });
        }
    }, [forbidden]);

    const onSubmit = async (user: LoginFormValues) => {
        try {

            await userApi.login(user);

            toast({
                title: "Вход выполнен",
                variant: "default"
            })

            router.push("/")

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
                toast({
                    title: "Ошибка при аутентификации",
                    description: `${error?.response?.data}`,
                    variant: "destructive"
                })
            } else {
                console.error("Неизвестная ошибка:", error);
                toast({
                    title: "Неизвестная ошибка",
                    variant: "destructive"
                })
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="max-w-md mx-auto"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <LogIn className="h-6 w-6 text-primary"/>
                                Вход в систему
                            </CardTitle>
                            <CardDescription>Введите ваши данные для входа</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Имя пользователя</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input placeholder="Введите имя пользователя" {...field}
                                                               className="pl-10"/>
                                                        <User
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Пароль</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="password" placeholder="••••••••" {...field}
                                                               className="pl-10"/>
                                                        <Lock
                                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Войти
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Нет аккаунта?{" "}
                                <Link href="/register" className="text-primary hover:underline">
                                    Зарегистрироваться
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}
