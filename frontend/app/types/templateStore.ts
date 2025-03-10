import type { Template } from "@/app/types/models"

class TemplateStore {
    private templates: Template[] = []

    addTemplate(template: Template) {
        this.templates.push(template)
    }

    removeTemplate(id: string) {
        this.templates = this.templates.filter((t) => t.id !== id)
    }

    getTemplates() {
        return this.templates
    }

    getTemplateById(id: string) {
        return this.templates.find((t) => t.id === id)
    }
}

export const templateStore = new TemplateStore()

