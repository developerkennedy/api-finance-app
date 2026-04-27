import { UsersRepository } from '../infra/repositories/users-repository'
import { JwtTokenService } from '../infra/services/jwt-token.service'
import { EnsureAuthenticatedMiddleware } from '../infra/http/middlewares/ensure-authenticated.middleware'

export function makeEnsureAuthenticatedMiddleware(): EnsureAuthenticatedMiddleware {
    const userRepository = new UsersRepository()
    const tokenService = new JwtTokenService()

    return new EnsureAuthenticatedMiddleware(tokenService, userRepository)
}
