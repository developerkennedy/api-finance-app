import { CreateRefreshTokenDto, RefreshTokenDto } from '../../domain/entities/refresh-token.entity'

export interface RefreshTokenRepositoryPorts {
    create(data: CreateRefreshTokenDto): Promise<RefreshTokenDto>
    findByHash(hash: string): Promise<RefreshTokenDto | null>
    deleteById(id: string): Promise<void>
}
