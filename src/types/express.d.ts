import type { ResponseUserDto } from '../domain/entities/user.entity'

declare global {
    namespace Express {
        interface Request {
            // O middleware de auth preenche este campo nas rotas privadas.
            user?: ResponseUserDto
        }
    }
}

export {}
