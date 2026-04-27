import { TransactionRepository } from '../infra/repositories/transaction-repository'
import { DeleteTransactionUseCase } from '../application/use-cases/delete-transaction.use-case'
import { DeleteTransactionController } from '../infra/http/controller/delete-transaction.controller'

export function makeDeleteTransactionController(): DeleteTransactionController {
    const transactionRepository = new TransactionRepository()
    const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepository)
    return new DeleteTransactionController(deleteTransactionUseCase)
}
