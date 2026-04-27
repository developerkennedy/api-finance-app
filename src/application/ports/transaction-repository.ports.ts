import { CreateTransactionDto, ResponseTransactionDto } from '../../domain/entities/transaction.entity'
import { PaginatedResult, PaginationParams } from '../../domain/entities/pagination.entity'

export interface TransactionRepositoryPort {
    create(data: CreateTransactionDto): Promise<ResponseTransactionDto>
    findByIdAndUserId(userId: string, id: string): Promise<ResponseTransactionDto | null>
    findManyByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<ResponseTransactionDto>>
    deleteByIdAndUserId(userId: string, id: string): Promise<void>
    updateByIdAndUserId(userId: string, id: string, data: Partial<CreateTransactionDto>): Promise<ResponseTransactionDto | null>
}
