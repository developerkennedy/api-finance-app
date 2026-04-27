import { Request, Response } from 'express'
import { loginSchema } from '../../../auth/schema'
import { LoginUseCase } from '../../../application/use-cases/login.use-case'
import { APIError } from '../../../domain/errors/errors'

export class LoginController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const parsed = loginSchema.safeParse(req.body)

        if (!parsed.success) {
            res.status(400).json({ message: parsed.error.flatten().fieldErrors })
            return
        }

        try {
            const tokens = await this.loginUseCase.execute(parsed.data)
            res.status(200).json(tokens)
        } catch (e) {
            if (e instanceof APIError) {
                res.status(401).json({ message: e.message })
                return
            }

            console.error('Unexpected error on login:', e)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
