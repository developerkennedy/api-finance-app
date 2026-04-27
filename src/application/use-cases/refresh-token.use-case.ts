import { randomUUID } from 'node:crypto'
import { APIError } from '../../domain/errors/errors'
import { RefreshTokenRepositoryPorts } from '../ports/refresh-token-repository.ports'
import { TokenServicePorts } from '../ports/token-service.ports'
import { env } from '../../main/config/env'

function parseDurationMs(duration: string): number {
    const units: Record<string, number> = {
        s: 1_000,
        m: 60_000,
        h: 3_600_000,
        d: 86_400_000,
    }
    const match = duration.match(/^(\d+)([smhd])$/)
    if (!match) throw new Error(`Invalid duration: ${duration}`)
    return Number(match[1]) * units[match[2]]
}

export class RefreshTokenUseCase {
    constructor(
        private readonly refreshTokenRepository: RefreshTokenRepositoryPorts,
        private readonly tokenService: TokenServicePorts,
    ) {}

    async execute(rawToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const tokenHash = this.tokenService.hashToken(rawToken)
        const stored = await this.refreshTokenRepository.findByHash(tokenHash)

        if (!stored) {
            throw new APIError('Invalid refresh token')
        }

        if (stored.expires_at_revoke < new Date()) {
            await this.refreshTokenRepository.deleteById(stored.id)
            throw new APIError('Refresh token expired')
        }

        // Rotação: o refresh token antigo deixa de valer no momento do refresh.
        await this.refreshTokenRepository.deleteById(stored.id)

        const newRawToken = randomUUID()
        const newHash = this.tokenService.hashToken(newRawToken)
        const expiresAt = new Date(Date.now() + parseDurationMs(String(env.JWT_REFRESH_EXPIRES_IN)))

        await this.refreshTokenRepository.create({
            userId: stored.userId,
            token_hash: newHash,
            expires_at_revoke: expiresAt,
        })

        // Como o usuário já foi validado pelo refresh token salvo, podemos emitir um novo access token.
        const accessToken = this.tokenService.signAccessToken({ sub: stored.userId })

        return { accessToken, refreshToken: newRawToken }
    }
}
