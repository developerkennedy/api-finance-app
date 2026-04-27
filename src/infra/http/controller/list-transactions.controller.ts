import { Request, Response } from 'express'
import { ListTransactionsUseCase } from '../../../application/use-cases/list-transactions.use-case'

export class ListTransactionsController {
    constructor(private readonly listTransactionsUseCase: ListTransactionsUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        const page = Math.max(1, parseInt(String(req.query.page)) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 20))

        const result = await this.listTransactionsUseCase.execute(req.user.id, { page, limit })
        res.status(200).json(result)
    }
}
