import { PaginatedResult, PaginationParams } from '../../domain/entities/pagination.entity'
import { ResponseTransactionDto } from '../../domain/entities/transaction.entity'
import { TransactionRepositoryPort } from '../ports/transaction-repository.ports'

export class ListTransactionsUseCase {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async execute(userId: string, params: PaginationParams): Promise<PaginatedResult<ResponseTransactionDto>> {
        return this.transactionRepository.findManyByUserId(userId, params)
    }
}
