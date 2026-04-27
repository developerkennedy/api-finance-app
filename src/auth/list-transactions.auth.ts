import { TransactionRepository } from '../infra/repositories/transaction-repository'
import { ListTransactionsUseCase } from '../application/use-cases/list-transactions.use-case'
import { ListTransactionsController } from '../infra/http/controller/list-transactions.controller'

export function makeListTransactionsController(): ListTransactionsController {
    const transactionRepository = new TransactionRepository()
    const listTransactionsUseCase = new ListTransactionsUseCase(transactionRepository)
    return new ListTransactionsController(listTransactionsUseCase)
}
