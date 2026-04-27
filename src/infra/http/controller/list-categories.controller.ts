import { Request, Response } from 'express'
import { ListCategoriesUseCase } from '../../../application/use-cases/list-categories.use-case'

export class ListCategoriesController {
    constructor(private readonly listCategoriesUseCase: ListCategoriesUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        const categories = await this.listCategoriesUseCase.execute(req.user.id)
        res.status(200).json(categories)
    }
}
