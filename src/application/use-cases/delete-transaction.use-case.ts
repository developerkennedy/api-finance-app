import { APIError } from '../../domain/errors/errors'
import { TransactionRepositoryPort } from '../ports/transaction-repository.ports'

export class DeleteTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async execute(userId: string, id: string): Promise<void> {
        const existing = await this.transactionRepository.findByIdAndUserId(userId, id)
        if (!existing) {
            throw new APIError('Transaction not found')
        }
        await this.transactionRepository.deleteByIdAndUserId(userId, id)
    }
}
