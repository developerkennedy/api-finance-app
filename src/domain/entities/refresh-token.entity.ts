import { z } from 'zod'

export const refreshTokenSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    token_hash: z.string().length(64),
    expires_at_revoke: z.date(),
    created_at: z.date(),
    updated_at: z.date(),
})

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>

export type CreateRefreshTokenDto = Pick<RefreshTokenDto, 'userId' | 'token_hash' | 'expires_at_revoke'>
