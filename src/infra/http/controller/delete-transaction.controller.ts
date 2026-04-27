import { Request, Response } from 'express'
import { APIError } from '../../../domain/errors/errors'
import { DeleteTransactionUseCase } from '../../../application/use-cases/delete-transaction.use-case'

export class DeleteTransactionController {
    constructor(private readonly deleteTransactionUseCase: DeleteTransactionUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        try {
            await this.deleteTransactionUseCase.execute(req.user.id, String(req.params.id))
            res.status(204).send()
        } catch (e) {
            if (e instanceof APIError) {
                res.status(404).json({ message: e.message })
                return
            }
            console.error('Unexpected error on delete transaction:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
