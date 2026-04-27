import { z } from 'zod'

export const categorySchema = z.object({
    id: z.uuid(),
    name: z.string().min(2).max(100),
    userId: z.uuid(),
    created_at: z.date(),
    updated_at: z.date(),
})

export const createCategorySchema = categorySchema.pick({
    name: true,
    userId: true,
})

export type CategoryDto = z.infer<typeof categorySchema>
export type CreateCategoryDto = z.infer<typeof createCategorySchema>
