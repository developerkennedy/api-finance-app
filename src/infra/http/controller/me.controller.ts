import { Request, Response } from 'express'

export class MeController {
    async handle(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthenticated' })
            return
        }

        res.status(200).json(req.user)
    }
}
