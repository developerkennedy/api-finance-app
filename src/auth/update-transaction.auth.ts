import { TransactionRepository } from '../infra/repositories/transaction-repository'
import { UpdateTransactionUseCase } from '../application/use-cases/update-transaction.use-case'
import { UpdateTransactionController } from '../infra/http/controller/update-transaction.controller'

export function makeUpdateTransactionController(): UpdateTransactionController {
    const transactionRepository = new TransactionRepository()
    const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository)
    return new UpdateTransactionController(updateTransactionUseCase)
}
