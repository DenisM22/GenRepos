"use client"

import React, {useEffect, useRef, useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Slider} from "@/components/ui/slider"
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Download, Minus, Plus, RefreshCw, User, Users} from "lucide-react"
import {toast} from "@/components/ui/use-toast"
import type {Person} from "@/app/types/models"
import {personApi} from "@/app/api/api";

interface FamilyTreeVisualizationProps {
    rootPerson: Person
    generations: {
        ancestors: number
        descendants: number
    }
}

export default function FamilyTreePage() {
    const params = useParams()
    const [rootPerson, setRootPerson] = useState<Person | null>(null)
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({x: 0, y: 0})
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({x: 0, y: 0})
    const [generations, setGenerations] = useState({ancestors: 2, descendants: 2})

    const treeContainerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    // Загрузка данных о человеке и его родословной
    useEffect(() => {
        const fetchPersonData = async () => {
            setLoading(true)
            try {

                await new Promise((resolve) => setTimeout(resolve, 300)) // Имитация задержки запроса
                const response = await personApi.getFamilyTree(params.id)

                setRootPerson(response.data)

                // Сбрасываем позицию и масштаб при смене человека
                setPosition({x: 0, y: 0})
                setZoom(1)
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error)
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные родословной",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchPersonData()
    }, [])

    const handleGedcomExport = async () => {
        if (!rootPerson) return;

        try {
            const response = await personApi.getGedcom(params.id);
            const fileData = response.data;

            if (fileData) {
                const blob = new Blob([fileData], {type: "text/plain"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Генеалогическое древо ${rootPerson.lastName} ${rootPerson.firstName}.ged`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                toast({
                    title: "Экспорт выполнен",
                    description: "Файл GEDCOM успешно создан и скачан",
                });
            } else {
                throw new Error("Полученные данные пусты");
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных: ", error);
            toast({
                title: "Ошибка",
                description: "Не удалось экспортировать файл",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Центрирование дерева после загрузки
    useEffect(() => {
        if (!loading && rootPerson && treeContainerRef.current && svgRef.current) {
            // Получаем размеры контейнера
            const containerRect = treeContainerRef.current.getBoundingClientRect()
            const containerWidth = containerRect.width
            const containerHeight = containerRect.height

            // Центрируем дерево
            setPosition({
                x: containerWidth / 2 - 2500,
                y: containerHeight / 2 - 1500,
            })
        }
    }, [loading, rootPerson])

    // Обработчики для управления масштабом и позицией
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.2, 2))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.2))
    }

    const handleResetView = () => {
        if (treeContainerRef.current) {
            const containerRect = treeContainerRef.current.getBoundingClientRect()
            setZoom(1)
            setPosition({
                x: containerRect.width / 2 - 2500,
                y: containerRect.height / 2 - 1500,
            })
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
            // Только левая кнопка мыши
            setIsDragging(true)
            setDragStart({x: e.clientX - position.x, y: e.clientY - position.y})
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    // Обработчик колесика мыши для масштабирования
    const handleWheel = (e: React.WheelEvent) => {
        // Предотвращаем стандартное поведение только внутри контейнера
        if (treeContainerRef.current && treeContainerRef.current.contains(e.target as Node)) {
            e.preventDefault()
            const delta = e.deltaY < 0 ? 0.2 : -0.2 // Шаг 10%
            setZoom((prev) => Math.max(0.2, Math.min(2, prev + delta)))
        }
    }

    // Добавляем обработчик события wheel на уровне документа
    useEffect(() => {
        const preventDefaultForTreeContainer = (e: WheelEvent) => {
            if (treeContainerRef.current && treeContainerRef.current.contains(e.target as Node)) {
                e.preventDefault()
            }
        }

        // Используем passive: false, чтобы иметь возможность вызвать preventDefault()
        document.addEventListener("wheel", preventDefaultForTreeContainer, {passive: false})

        return () => {
            document.removeEventListener("wheel", preventDefaultForTreeContainer)
        }
    }, [])

    // Обработчик изменения количества поколений
    const handleGenerationsChange = (type: "ancestors" | "descendants", value: number[]) => {
        setGenerations((prev) => ({
            ...prev,
            [type]: value[0],
        }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <Header/>
                <main className="container mx-auto px-4 py-12">
                    <div className="flex justify-center items-center h-[600px]">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw className="h-12 w-12 text-primary animate-spin"/>
                            <p className="text-lg">Загрузка родословной...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (!rootPerson) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <Header/>
                <main className="container mx-auto px-4 py-12">
                    <div className="flex justify-center items-center h-[600px]">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-lg">Не удалось загрузить данные родословной</p>
                            <Button asChild>
                                <Link href="/people">Вернуться к списку людей</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
            <Header/>
            <main className="flex-1 flex flex-col p-2">
                <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-1 px-4">
                        <CardTitle className="text-lg flex items-center gap-1">
                            <Users className="h-4 w-4 text-primary"/>
                            {rootPerson.lastName} {rootPerson.firstName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGedcomExport}
                                className="h-7 text-xs"
                            >
                                <Download className="h-3 w-3 mr-1"/>
                                Экспорт
                            </Button>
                            <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                                <Link href={`/people/${rootPerson.id}`}>
                                    <User className="h-3 w-3 mr-1"/>
                                    Профиль
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        {/* Контейнер для родословного древа */}
                        <div
                            className="flex-1 relative overflow-hidden"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onWheel={handleWheel}
                            ref={treeContainerRef}
                        >
                            <div
                                className="absolute transition-transform duration-100 ease-out"
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                    transformOrigin: "center",
                                    cursor: isDragging ? "grabbing" : "grab",
                                }}
                            >
                                <FamilyTreeVisualization rootPerson={rootPerson} generations={generations}
                                                         ref={svgRef}/>
                            </div>

                            {/* Блок со стрелками */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-4 bg-card border rounded-md p-2 shadow-md ">
                                <div className="grid grid-cols-3 gap-1">
                                    <div></div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setPosition((prev) => ({...prev, y: prev.y + 100}))}
                                        title="Вверх"
                                    >
                                        <ArrowUp className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setPosition((prev) => ({...prev, x: prev.x + 100}))}
                                        title="Влево"
                                    >
                                        <ArrowLeft className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setPosition((prev) => ({...prev, x: prev.x - 100}))}
                                        title="Вправо"
                                    >
                                        <ArrowRight className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setPosition((prev) => ({...prev, y: prev.y - 100}))}
                                        title="Вниз"
                                    >
                                        <ArrowDown className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                </div>
                            </div>

                            {/* Блок с настройкой поколений под блоком со стрелками */}
                            <div className="absolute bottom-4 left-4 bg-card border rounded-md p-3 shadow-md">
                                <div className="flex flex-col gap-3">
                                    <div className="text-xs font-medium text-center border-b pb-1">Поколения</div>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-medium">Предки:</span>
                                                <span className="text-xs font-semibold">{generations.ancestors}</span>
                                            </div>
                                            <Slider
                                                value={[generations.ancestors]}
                                                min={0}
                                                max={5}
                                                step={1}
                                                className="w-32"
                                                onValueChange={(value) => handleGenerationsChange("ancestors", value)}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-medium">Потомки:</span>
                                                <span className="text-xs font-semibold">{generations.descendants}</span>
                                            </div>
                                            <Slider
                                                value={[generations.descendants]}
                                                min={0}
                                                max={5}
                                                step={1}
                                                className="w-32"
                                                onValueChange={(value) => handleGenerationsChange("descendants", value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Кнопка центрирования и масштабирования в правом нижнем углу */}
                            <div className="absolute bottom-24 right-4 bg-card border rounded-md p-2 shadow-md">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleResetView}
                                    title="Центрировать"
                                >
                                    <RefreshCw className="h-4 w-4"/>
                                </Button>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-card border rounded-md p-2 shadow-md">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-xs text-center">Масштаб: {Math.round(zoom * 100)}%</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-6 w-6"
                                                onClick={handleZoomOut}>
                                            <Minus className="h-3 w-3"/>
                                        </Button>
                                        <div className="w-16 h-1 bg-muted-foreground/30 rounded-full">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{width: `${((zoom - 0.1) / 1.9) * 100}%`}}
                                            ></div>
                                        </div>
                                        <Button variant="outline" size="icon" className="h-6 w-6"
                                                onClick={handleZoomIn}>
                                            <Plus className="h-3 w-3"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Подсказка по управлению */}
                            <div className="absolute top-4 left-4 bg-card border rounded-md p-2 shadow-md text-xs">
                                <div className="font-medium mb-1">Управление:</div>
                                <div className="flex flex-col gap-1 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <RefreshCw className="h-3 w-3"/> Центрирование: кнопка справа внизу
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ArrowUp className="h-3 w-3"/> Навигация: стрелки слева внизу
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Plus className="h-3 w-3"/> Масштаб: колесико мыши или кнопки +/-
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Легенда */}
                        <div className="flex flex-wrap gap-4 justify-center border-t pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm">Мужчины</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span className="text-sm">Женщины</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-sm">Выбранный человек</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-gray-400"></div>
                                <span className="text-sm">Родственная связь</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-purple-500"></div>
                                <span className="text-sm">Брачная связь</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

// Компонент визуализации родословного древа с использованием forwardRef
const FamilyTreeVisualization = React.forwardRef<SVGSVGElement, FamilyTreeVisualizationProps>(
    ({rootPerson, generations}, ref) => {
        // Центрирование корневого человека
        const centerX = 2500 // Центр по горизонтали
        const centerY = 1500 // Центр по вертикали

        return (
            <svg width="5000" height="3000" viewBox="0 0 5000 3000" ref={ref}>
                {/* Линии связей */}
                <g className="family-lines">{renderFamilyLines(rootPerson, centerX, centerY, generations)}</g>

                {/* Узлы людей */}
                <g className="family-nodes">{renderFamilyNodes(rootPerson, centerX, centerY, generations)}</g>
            </svg>
        )
    },
)

FamilyTreeVisualization.displayName = "FamilyTreeVisualization"

// Функция для отрисовки линий связей с углами
const renderFamilyLines = (
    person: Person,
    centerX: number,
    centerY: number,
    generations: { ancestors: number; descendants: number },
    level = 0,
    position: "center" | "left" | "right" = "center",
    parentX?: number,
    parentY?: number,
) => {
    const lines: React.JSX.Element[] = []

    // Расстояние между поколениями и людьми
    const generationHeight = (generations.ancestors < 3 && generations.descendants < 3) ? 110 : 150;
    const personWidth = (generations.ancestors < 3 && generations.descendants < 3) ? 220 : 440;

    // Определяем координаты текущего человека
    let x = centerX
    let y = centerY

    // Смещение в зависимости от уровня и позиции
    if (level < 0) {
        // Предки (вверх)
        y = centerY + level * generationHeight

        if (position === "left") {
            x = centerX - personWidth / 2
        } else if (position === "right") {
            x = centerX + personWidth / 2
        }
    } else if (level > 0) {
        // Потомки (вниз)
        y = centerY + level * generationHeight

        // Для детей распределяем по горизонтали
        if (person.children && person.children.length > 0) {
            const childCount = person.children.length
            const totalWidth = (childCount - 1) * personWidth

            // Если это первый уровень потомков, центрируем относительно корня
            if (level === 1) {
                x = centerX - totalWidth / 2 + (position === "left" ? 0 : position === "right" ? totalWidth : 0)
            }
        }
    }

    // Если это корневой человек и у него есть супруг(а), добавляем линию связи между ними
    if (level === 0 && person.spouse) {
        const spouseX = x + personWidth * 1.2
        lines.push(
            <line
                key={`line-${person.id}-spouse`}
                x1={x + 80} // Правая сторона карточки человека
                y1={y}
                x2={spouseX - 80} // Левая сторона карточки супруга
                y2={y}
                stroke="#9333ea" // Фиолетовый цвет для брачной связи
                strokeWidth="2"
                strokeDasharray="5,3" // Пунктирная линия для брачной связи
            />,
        )
    }

    // Если есть родитель, рисуем линию от родителя к текущему человеку с углом
    if (parentX !== undefined && parentY !== undefined) {
        // Рисуем линию с углом (L-образную)
        const midY = (parentY + 30 + y - 30) / 2

        lines.push(
            // Вертикальная часть от родителя
            <line
                key={`line-${person.id}-parent-v`}
                x1={parentX}
                y1={parentY + 30} // Нижняя часть карточки родителя
                x2={parentX}
                y2={midY}
                stroke="#94a3b8"
                strokeWidth="2"
            />,
            // Горизонтальная часть
            <line
                key={`line-${person.id}-parent-h`}
                x1={parentX}
                y1={midY}
                x2={x}
                y2={midY}
                stroke="#94a3b8"
                strokeWidth="2"
            />,
            // Вертикальная часть к текущему человеку
            <line
                key={`line-${person.id}-parent-v2`}
                x1={x}
                y1={midY}
                x2={x}
                y2={y + 30} // Верхняя часть карточки текущего человека
                stroke="#94a3b8"
                strokeWidth="2"
            />,
        )
    }

    // Рисуем линии к детям, если есть и если не превышен лимит поколений потомков
    if (person.children && person.children.length > 0 && level < generations.descendants) {
        const childCount = person.children.length
        const totalWidth = (childCount - 1) * personWidth
        let startX = x - totalWidth / 2

        // Если это первый уровень, центрируем детей относительно родителя
        if (level === 0) {
            startX = centerX - totalWidth / 2
        }

        // Рисуем горизонтальную линию, соединяющую всех детей
        if (childCount > 1) {
            lines.push(
                <line
                    key={`line-${person.id}-children-horizontal`}
                    x1={startX}
                    y1={y + generationHeight - 30}
                    x2={startX + totalWidth}
                    y2={y + generationHeight - 30}
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )
        }

        // Рисуем вертикальную линию от родителя к горизонтальной линии детей
        lines.push(
            <line
                key={`line-${person.id}-children-vertical`}
                x1={x}
                y1={y + 30} // Нижняя часть карточки родителя
                x2={x}
                y2={y + generationHeight + 30}
                stroke="#94a3b8"
                strokeWidth="2"
            />,
        )

        // Рекурсивно рисуем линии для каждого ребенка
        person.children.forEach((child, index) => {
            const childX = startX + index * personWidth
            const childY = y + generationHeight

            // Рисуем вертикальную линию от горизонтальной линии к ребенку
            if (childCount > 1) {
                lines.push(
                    <line
                        key={`line-${person.id}-child-${child.id}`}
                        x1={childX}
                        y1={childY - 30}
                        x2={childX}
                        y2={childY + 30}
                        stroke="#94a3b8"
                        strokeWidth="2"
                    />,
                )
            }

            // Рекурсивно рисуем линии для потомков ребенка
            lines.push(
                ...renderFamilyLines(
                    child as Person,
                    childX,
                    childY,
                    generations,
                    level + 1,
                    index === 0 ? "left" : index === childCount - 1 ? "right" : "center",
                    childX,
                    childY,
                ),
            )
        })
    }

    // Рисуем линии к родителям, если есть и если не превышен лимит поколений предков
    if (level > -generations.ancestors) {
        // Проверяем, есть ли оба родителя
        if (person.father && person.mother) {
            const fatherX = x - personWidth / 2
            const fatherY = y - generationHeight
            const motherX = x + personWidth / 2
            const motherY = y - generationHeight

            // Общая точка соединения для обоих родителей
            const midY = (y - 30 + fatherY + 30) / 2

            // Вертикальная линия от текущего человека к точке соединения
            lines.push(
                <line
                    key={`line-${person.id}-parents-v1`}
                    x1={x}
                    y1={y - 30} // Верхняя часть карточки текущего человека
                    x2={x}
                    y2={midY}
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )

            // Горизонтальная линия, соединяющая обоих родителей
            lines.push(
                <line
                    key={`line-${person.id}-parents-h`}
                    x1={fatherX}
                    y1={midY}
                    x2={motherX}
                    y2={midY}
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )

            // Вертикальные линии к каждому из родителей
            lines.push(
                <line
                    key={`line-${person.id}-father-v2`}
                    x1={fatherX}
                    y1={midY}
                    x2={fatherX}
                    y2={fatherY + 30} // Нижняя часть карточки отца
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
                <line
                    key={`line-${person.id}-mother-v2`}
                    x1={motherX}
                    y1={midY}
                    x2={motherX}
                    y2={motherY + 30} // Нижняя часть карточки матери
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )

            // Рекурсивно рисуем линии для предков
            lines.push(
                ...renderFamilyLines(
                    person.father as Person,
                    fatherX,
                    fatherY,
                    generations,
                    level - 1,
                    "left",
                    fatherX,
                    fatherY,
                ),
                ...renderFamilyLines(
                    person.mother as Person,
                    motherX,
                    motherY,
                    generations,
                    level - 1,
                    "right",
                    motherX,
                    motherY,
                ),
            )
        }
        // Если есть только отец
        else if (person.father) {
            const fatherX = x - personWidth / 2
            const fatherY = y - generationHeight

            // Рисуем прямую линию от текущего человека к отцу
            lines.push(
                <line
                    key={`line-${person.id}-father-direct`}
                    x1={x}
                    y1={y - 30} // Верхняя часть карточки текущего человека
                    x2={fatherX}
                    y2={fatherY + 30} // Нижняя часть карточки отца
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )

            // Рекурсивно рисуем линии для предков отца
            lines.push(
                ...renderFamilyLines(
                    person.father as Person,
                    fatherX,
                    fatherY,
                    generations,
                    level - 1,
                    "left",
                    fatherX,
                    fatherY,
                ),
            )
        }
        // Если есть только мать
        else if (person.mother) {
            const motherX = x + personWidth / 2
            const motherY = y - generationHeight

            // Рисуем прямую линию от текущего человека к матери
            lines.push(
                <line
                    key={`line-${person.id}-mother-direct`}
                    x1={x}
                    y1={y - 30} // Верхняя часть карточки текущего человека
                    x2={motherX}
                    y2={motherY + 30} // Нижняя часть карточки матери
                    stroke="#94a3b8"
                    strokeWidth="2"
                />,
            )

            // Рекурсивно рисуем линии для предков матери
            lines.push(
                ...renderFamilyLines(
                    person.mother as Person,
                    motherX,
                    motherY,
                    generations,
                    level - 1,
                    "right",
                    motherX,
                    motherY,
                ),
            )
        }
    }

    return lines
}

// Функция для отрисовки узлов людей
const renderFamilyNodes = (
    person: Person,
    centerX: number,
    centerY: number,
    generations: { ancestors: number; descendants: number },
    level = 0,
    position: "center" | "left" | "right" = "center",
) => {
    const nodes: React.JSX.Element[] = []

    // Расстояние между поколениями и людьми
    const generationHeight = (generations.ancestors < 3 && generations.descendants < 3) ? 110 : 150;
    const personWidth = (generations.ancestors < 3 && generations.descendants < 3) ? 220 : 440;

    // Определяем координаты текущего человека
    let x = centerX
    let y = centerY

    // Смещение в зависимости от уровня и позиции
    if (level < 0) {
        // Предки (вверх)
        y = centerY + level * generationHeight

        if (position === "left") {
            x = centerX - personWidth / 2
        } else if (position === "right") {
            x = centerX + personWidth / 2
        }
    } else if (level > 0) {
        // Потомки (вниз)
        y = centerY + level * generationHeight

        // Для детей распределяем по горизонтали
        if (person.children && person.children.length > 0) {
            const childCount = person.children.length
            const totalWidth = (childCount - 1) * personWidth

            // Если это первый уровень потомков, центрируем относительно корня
            if (level === 1) {
                x = centerX - totalWidth / 2 + (position === "left" ? 0 : position === "right" ? totalWidth : 0)
            }
        }
    }

    // Добавляем узел текущего человека
    nodes.push(
        <foreignObject key={`node-${person.id}`} x={x - 80} y={y - 30} width="160" height="60">
            <div
                className={`
          flex flex-col p-2 rounded-md border shadow-sm w-full h-full overflow-hidden
          ${
                    level === 0
                        ? "bg-primary/10 border-primary"
                        : person.gender === "MALE"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-pink-50 border-pink-200"
                }
        `}
                style={{
                    backgroundColor:
                        level === 0
                            ? "rgba(var(--primary), 0.1)"
                            : person.gender === "MALE"
                                ? "rgba(239, 246, 255, 1)"
                                : "rgb(251,237,245)",
                }}
            >
                <div className="flex items-center justify-between">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            level === 0 ? "bg-primary" : person.gender === "MALE" ? "bg-blue-500" : "bg-pink-500"
                        }`}
                    ></div>
                    <a
                        href={`/people/${person.id}`}
                        className="text-xs text-muted-foreground hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Профиль
                    </a>
                </div>
                <div className="text-xs font-medium truncate">
                    {person.lastName} {person.firstName}
                </div>
                <div className="text-[8px] text-muted-foreground">
                    {person.birthDate?.exactDate} {person.birthDate?.exactDate}
                </div>
            </div>
        </foreignObject>,
    )

    // Добавляем узел супруга, если есть (только для корневого человека)
    if (level === 0 && person.spouse) {
        const spouseX = x + personWidth * 1.2
        nodes.push(
            <foreignObject key={`node-${person.id}-spouse`} x={spouseX - 80} y={y - 30} width="160" height="60">
                <div
                    className={`
            flex flex-col p-2 rounded-md border shadow-sm w-full h-full overflow-hidden
            ${person.spouse.gender === "MALE" ? "bg-blue-50 border-blue-200" : "bg-pink-50 border-pink-200"}
          `}
                    style={{
                        backgroundColor: person.spouse.gender === "MALE" ? "rgba(239, 246, 255, 0.8)" : "rgba(252, 231, 243, 0.8)",
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div
                            className={`w-3 h-3 rounded-full ${person.spouse.gender === "MALE" ? "bg-blue-500" : "bg-pink-500"}`}
                        ></div>
                        <a
                            href={`/people/${person.spouse.id}`}
                            className="text-xs text-muted-foreground hover:text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Профиль
                        </a>
                    </div>
                    <div className="text-xs font-medium truncate">
                        {person.spouse.lastName} {person.spouse.firstName}
                    </div>
                    <div className="text-[8px] text-muted-foreground">
                        {person.spouse.birthDate?.exactDate} {person.spouse.birthDate?.exactDate}
                    </div>
                </div>
            </foreignObject>,
        )
    }

    // Рекурсивно добавляем узлы детей, если есть и если не превышен лимит поколений потомков
    if (person.children && person.children.length > 0 && level < generations.descendants) {
        const childCount = person.children.length
        const totalWidth = (childCount - 1) * personWidth
        let startX = x - totalWidth / 2

        // Если это первый уровень, центрируем детей относительно родителя
        if (level === 0) {
            startX = centerX - totalWidth / 2
        }

        person.children.forEach((child, index) => {
            const childX = startX + index * personWidth
            const childY = y + generationHeight

            nodes.push(
                ...renderFamilyNodes(
                    child as Person,
                    childX,
                    childY,
                    generations,
                    level + 1,
                    index === 0 ? "left" : index === childCount - 1 ? "right" : "center",
                ),
            )
        })
    }

    // Рекурсивно добавляем узлы родителей, если есть и если не превышен лимит поколений предков
    if (level > -generations.ancestors) {
        if (person.father) {
            const fatherX = x - personWidth / 2
            const fatherY = y - generationHeight

            nodes.push(...renderFamilyNodes(person.father as Person, fatherX, fatherY, generations, level - 1, "left"))
        }

        if (person.mother) {
            const motherX = x + personWidth / 2
            const motherY = y - generationHeight

            nodes.push(...renderFamilyNodes(person.mother as Person, motherX, motherY, generations, level - 1, "right"))
        }
    }

    return nodes
}
