import { Request, Response } from 'express'
import { APIError } from '../../../domain/errors/errors'
import { updateTransactionHttpSchema } from '../../../auth/schema'
import { UpdateTransactionUseCase } from '../../../application/use-cases/update-transaction.use-case'

export class UpdateTransactionController {
    constructor(private readonly updateTransactionUseCase: UpdateTransactionUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const parsed = updateTransactionHttpSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        try {
            const transaction = await this.updateTransactionUseCase.execute(
                req.user.id,
                String(req.params.id),
                parsed.data,
            )
            res.status(200).json(transaction)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(404).json({ message: e.message })
                return
            }
            console.error('Unexpected error on update transaction:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
