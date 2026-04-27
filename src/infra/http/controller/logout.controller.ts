import { Request, Response } from 'express'
import { logoutSchema } from '../../../auth/schema'
import { LogoutUseCase } from '../../../application/use-cases/logout.use-case'
import { APIError } from '../../../domain/errors/errors'

export class LogoutController {
    constructor(private readonly logoutUseCase: LogoutUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const parsed = logoutSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        try {
            await this.logoutUseCase.execute(parsed.data.refresh_token)
            res.status(204).send()
        } catch (e) {
            if (e instanceof APIError) {
                res.status(401).json({ message: e.message })
                return
            }

            console.error('Unexpected error on logout:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
