import { eq } from 'drizzle-orm'
import { db } from '../database/client'
import { RefreshToken } from '../database/schema'
import { RefreshTokenRepositoryPorts } from '../../application/ports/refresh-token-repository.ports'
import { CreateRefreshTokenDto, RefreshTokenDto } from '../../domain/entities/refresh-token.entity'

export class RefreshTokenRepository implements RefreshTokenRepositoryPorts {
    async create(data: CreateRefreshTokenDto): Promise<RefreshTokenDto> {
        const [token] = await db.insert(RefreshToken).values(data).returning()
        return token
    }

    async findByHash(hash: string): Promise<RefreshTokenDto | null> {
        const token = await db.query.RefreshToken.findFirst({
            where: eq(RefreshToken.token_hash, hash),
        })
        return token ?? null
    }

    async deleteById(id: string): Promise<void> {
        await db.delete(RefreshToken).where(eq(RefreshToken.id, id))
    }
}
