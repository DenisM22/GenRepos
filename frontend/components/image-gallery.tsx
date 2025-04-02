"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageItem {
    id: number
    image: string
    title: string
    description?: string
    icon?: React.ReactNode
}

interface ImageGalleryProps {
    images: ImageItem[]
    isOpen: boolean
    onClose: () => void
}

export function ImageGallery({ images, isOpen, onClose }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    if (!isOpen) return null

    const handlePrevious = () => {
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") handlePrevious()
        if (e.key === "ArrowRight") handleNext()
        if (e.key === "Escape") onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col overflow-auto" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="sticky top-0 w-full bg-background/95 backdrop-blur-sm p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                    Галерея изображений ({activeIndex + 1}/{images.length})
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-6 w-6" />
                </Button>
            </div>

            {images.length > 0 ? (
                <>
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="relative max-w-4xl w-full">
                            {images.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/20 backdrop-blur-sm hover:bg-background/40"
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/20 backdrop-blur-sm hover:bg-background/40"
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </>
                            )}
                            <a href={images[activeIndex].image} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={images[activeIndex].image || "/placeholder.svg"}
                                    alt={images[activeIndex].description || images[activeIndex].title}
                                    className="max-h-[80vh] mx-auto object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="bg-background p-4">
                        <div className="flex items-center gap-2 mb-2">
                            {images[activeIndex].icon}
                            <h3 className="text-lg font-medium">{images[activeIndex].title}</h3>
                        </div>
                        {images[activeIndex].description && (
                            <p className="text-muted-foreground">{images[activeIndex].description}</p>
                        )}
                    </div>
                    {images.length > 5 && (
                        <div className="bg-muted/30 p-4 overflow-x-auto">
                            <div className="flex gap-2">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setActiveIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded overflow-hidden ${
                                            index === activeIndex ? "ring-2 ring-primary" : ""
                                        }`}
                                    >
                                        <img
                                            src={image.image || "/placeholder.svg"}
                                            alt={image.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-muted-foreground">Нет изображений для отображения</p>
                </div>
            )}
        </div>
    )
}

