import { sign, verify } from 'jsonwebtoken'
import { createHash } from 'node:crypto'
import { env } from '../../main/config/env'
import { TokenServicePorts } from '../../application/ports/token-service.ports'

export class JwtTokenService implements TokenServicePorts {
    signAccessToken(payload: { sub: string }): string {
        // O sub carrega o id do usuário autenticado.
        return sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd'}`,
            issuer: env.JWT_ISSUER,
        })
    }

    verifyAccessToken(token: string): { sub: string } {
        // Verifica assinatura, expiração e issuer do JWT.
        const decoded = verify(token, env.JWT_ACCESS_SECRET, {
            issuer: env.JWT_ISSUER,
        })
        if (typeof decoded === 'string' || !decoded.sub) {
            throw new Error('Invalid token payload')
        }
        return { sub: decoded.sub }
    }

    hashToken(token: string): string {
        // O hash permite validar refresh token sem salvar o valor original no banco.
        return createHash('sha256').update(token).digest('hex')
    }
}
