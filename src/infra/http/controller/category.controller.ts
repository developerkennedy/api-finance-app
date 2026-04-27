import { Request, Response } from 'express'
import { APIError } from '../../../domain/errors/errors'
import { categoryHttpSchema } from '../../../auth/schema'
import { CreateCategoryUseCase } from '../../../application/use-cases/create-category.use-case'

export class CreateCategoryController {
    constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

    async handle(req: Request, res: Response): Promise<void>{
        const parsed = categoryHttpSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        try {
            const category = await this.createCategoryUseCase.execute({
                name: parsed.data.name,
                userId: req.user.id,
            })

            res.status(201).json(category)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(400).json({ message: e.message })
                return
            }

            console.error('Unexpected error on create category:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
