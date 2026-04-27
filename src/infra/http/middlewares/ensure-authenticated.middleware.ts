import { NextFunction, Request, Response } from 'express'
import { TokenServicePorts } from '../../../application/ports/token-service.ports'
import { UserRepositoryPorts } from '../../../application/ports/user-repository.ports'

export class EnsureAuthenticatedMiddleware {
    constructor(
        private readonly tokenService: TokenServicePorts,
        private readonly userRepository: UserRepositoryPorts,
    ) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            res.status(401).json({ message: 'Missing authorization header' })
            return
        }

        const [scheme, token] = authHeader.split(' ')

        if (scheme !== 'Bearer' || !token) {
            res.status(401).json({ message: 'Invalid authorization header format' })
            return
        }

        try {
            // Lê o id do usuário dentro do JWT.
            const { sub } = this.tokenService.verifyAccessToken(token)
            // Confirma no banco que o usuário ainda existe.
            const user = await this.userRepository.findById(sub)

            if (!user) {
                res.status(401).json({ message: 'User no longer exists' })
                return
            }

            // Depois disso qualquer controller pode usar req.user com segurança.
            req.user = user
            next()
        } catch {
            res.status(401).json({ message: 'Invalid or expired access token' })
        }
    }
}
