import { Request, Response } from 'express'
import { APIError } from '../../../domain/errors/errors'
import { GetTransactionUseCase } from '../../../application/use-cases/get-transaction.use-case'

export class GetTransactionController {
    constructor(private readonly getTransactionUseCase: GetTransactionUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        try {
            const transaction = await this.getTransactionUseCase.execute(req.user.id, String(req.params.id))
            res.status(200).json(transaction)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(404).json({ message: e.message })
                return
            }
            console.error('Unexpected error on get transaction:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
