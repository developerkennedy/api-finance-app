import { UsersRepository } from '../infra/repositories/users-repository'
import { RefreshTokenRepository } from '../infra/repositories/refresh-token.repository'
import { JwtTokenService } from '../infra/services/jwt-token.service'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import { LoginController } from '../infra/http/controller/login.controller'

export function makeLoginController(): LoginController {
    const userRepository = new UsersRepository()
    const refreshTokenRepository = new RefreshTokenRepository()
    const tokenService = new JwtTokenService()

    const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, tokenService)

    return new LoginController(loginUseCase)
}
