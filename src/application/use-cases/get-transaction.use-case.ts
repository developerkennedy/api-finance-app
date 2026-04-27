import { APIError } from '../../domain/errors/errors'
import { ResponseTransactionDto } from '../../domain/entities/transaction.entity'
import { TransactionRepositoryPort } from '../ports/transaction-repository.ports'

export class GetTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async execute(userId: string, id: string): Promise<ResponseTransactionDto> {
        const transaction = await this.transactionRepository.findByIdAndUserId(userId, id)
        if (!transaction) {
            throw new APIError('Transaction not found')
        }
        return transaction
    }
}
