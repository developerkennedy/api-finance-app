import { CreateTransactionDto, ResponseTransactionDto } from '../../domain/entities/transaction.entity'
import { TransactionRepositoryPort } from '../ports/transaction-repository.ports'

export class CreateTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepositoryPort) {}

    async execute(data: CreateTransactionDto): Promise<ResponseTransactionDto> {
        return this.transactionRepository.create(data)
    }
}
