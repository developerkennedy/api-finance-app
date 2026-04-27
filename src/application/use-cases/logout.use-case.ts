import { APIError } from '../../domain/errors/errors'
import { RefreshTokenRepositoryPorts } from '../ports/refresh-token-repository.ports'
import { TokenServicePorts } from '../ports/token-service.ports'

export class LogoutUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepositoryPorts,
        private readonly tokenService: TokenServicePorts,
    ) {}

    async execute(rawToken: string): Promise<void> {
        // Logout aqui significa invalidar o refresh token salvo no banco.
        const tokenHash = this.tokenService.hashToken(rawToken)
        const stored = await this.refreshTokenRepository.findByHash(tokenHash)

        if (!stored) {
            throw new APIError('Invalid refresh token')
        }

        await this.refreshTokenRepository.deleteById(stored.id)
    }
}
