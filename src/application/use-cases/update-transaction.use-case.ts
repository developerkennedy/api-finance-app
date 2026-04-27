import { APIError } from '../../domain/errors/errors'
import { CreateTransactionDto, ResponseTransactionDto } from '../../domain/entities/transaction.entity'
import { TransactionRepositoryPort } from '../ports/transaction-repository.ports'

export class UpdateTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async execute(userId: string, id: string, data: Partial<CreateTransactionDto>): Promise<ResponseTransactionDto> {
        const existing = await this.transactionRepository.findByIdAndUserId(userId, id)
        if (!existing) {
            throw new APIError('Transaction not found')
        }
        const updated = await this.transactionRepository.updateByIdAndUserId(userId, id, data)
        return updated!
    }
}
