import { Request, Response } from 'express'
import { APIError } from '../../../domain/errors/errors'
import { createTransactionHttpSchema } from '../../../auth/schema'
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case'

export class CreateTransactionController {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const parsed = createTransactionHttpSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        try {
            const transaction = await this.createTransactionUseCase.execute({
                ...parsed.data,
                userId: req.user.id,
            })
            res.status(201).json(transaction)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(400).json({ message: e.message })
                return
            }
            console.error('Unexpected error on create transaction:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
