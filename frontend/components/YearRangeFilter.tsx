"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "lucide-react"

interface YearRangeFilterProps {
    placeholder: string
    onRangeChange: (startYear: string, endYear: string) => void
}

export function YearRangeFilter({ placeholder, onRangeChange }: YearRangeFilterProps) {
    const [startYear, setStartYear] = useState("")
    const [endYear, setEndYear] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleApply = () => {
        onRangeChange(startYear, endYear)
        setIsOpen(false)
    }

    const displayValue =
        startYear && endYear
            ? `${startYear} - ${endYear}`
            : startYear
                ? `От ${startYear}`
                : endYear
                    ? `До ${endYear}`
                    : placeholder

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="truncate">{displayValue}</span>
                    <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4">
                <div className="space-y-4">
                    <h4 className="font-medium">Диапазон лет</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <label className="text-sm">От</label>
                            <Input
                                type="number"
                                placeholder="Начало"
                                value={startYear}
                                onChange={(e) => setStartYear(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">До</label>
                            <Input type="number" placeholder="Конец" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
                        </div>
                    </div>
                    <Button onClick={handleApply} className="w-full">
                        Применить
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

