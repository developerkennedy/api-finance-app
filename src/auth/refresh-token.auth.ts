import { RefreshTokenRepository } from '../infra/repositories/refresh-token.repository'
import { JwtTokenService } from '../infra/services/jwt-token.service'
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case'
import { RefreshTokenController } from '../infra/http/controller/refresh-token.controller'

export function makeRefreshTokenController(): RefreshTokenController {
    const refreshTokenRepository = new RefreshTokenRepository()
    const tokenService = new JwtTokenService()
    const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService)
    return new RefreshTokenController(refreshTokenUseCase)
}
