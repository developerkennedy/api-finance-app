import { RefreshTokenRepository } from '../infra/repositories/refresh-token.repository'
import { JwtTokenService } from '../infra/services/jwt-token.service'
import { LogoutUseCase } from '../application/use-cases/logout.use-case'
import { LogoutController } from '../infra/http/controller/logout.controller'

export function makeLogoutController(): LogoutController {
    const refreshTokenRepository = new RefreshTokenRepository()
    const tokenService = new JwtTokenService()
    const logoutUseCase = new LogoutUseCase(refreshTokenRepository, tokenService)
    return new LogoutController(logoutUseCase)
}
