import { compare } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { APIError } from '../../domain/errors/errors'
import { env } from '../../main/config/env'
import { UserRepositoryPorts } from '../ports/user-repository.ports'
import { RefreshTokenRepositoryPorts } from '../ports/refresh-token-repository.ports'
import { TokenServicePorts } from '../ports/token-service.ports'

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

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPorts,
        private readonly refreshTokenRepository: RefreshTokenRepositoryPorts,
        private readonly tokenService: TokenServicePorts,
    ) {}

    async execute(data: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userRepository.findByEmail(data.email)

        if (!user) {
            throw new APIError('Invalid credentials')
        }

        const passwordMatches = await compare(data.password, user.password)

        if (!passwordMatches) {
            throw new APIError('Invalid credentials')
        }

        // O refresh token é um valor aleatório para o cliente guardar.
        const rawRefreshToken = randomUUID()
        // No banco salvamos só o hash, nunca o token cru.
        const tokenHash = this.tokenService.hashToken(rawRefreshToken)
        const expiresAt = new Date(Date.now() + parseDurationMs(String(env.JWT_REFRESH_EXPIRES_IN)))

        await this.refreshTokenRepository.create({
            userId: user.id,
            token_hash: tokenHash,
            expires_at_revoke: expiresAt,
        })

        // O access token é o JWT usado para acessar rotas protegidas.
        const accessToken = this.tokenService.signAccessToken({ sub: user.id })

        return { accessToken, refreshToken: rawRefreshToken }
    }
}
