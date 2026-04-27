import { Request, Response } from 'express'
import { refreshSchema } from '../../../auth/schema'
import { RefreshTokenUseCase } from '../../../application/use-cases/refresh-token.use-case'
import { APIError } from '../../../domain/errors/errors'

export class RefreshTokenController {
    constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const parsed = refreshSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        try {
            const tokens = await this.refreshTokenUseCase.execute(parsed.data.refresh_token)
            res.status(200).json(tokens)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(401).json({ message: e.message })
                return
            }

            console.error('Unexpected error on refresh:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
