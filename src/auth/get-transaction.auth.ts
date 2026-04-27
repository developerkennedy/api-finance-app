import { TransactionRepository } from '../infra/repositories/transaction-repository'
import { GetTransactionUseCase } from '../application/use-cases/get-transaction.use-case'
import { GetTransactionController } from '../infra/http/controller/get-transaction.controller'

export function makeGetTransactionController(): GetTransactionController {
    const transactionRepository = new TransactionRepository()
    const getTransactionUseCase = new GetTransactionUseCase(transactionRepository)
    return new GetTransactionController(getTransactionUseCase)
}
