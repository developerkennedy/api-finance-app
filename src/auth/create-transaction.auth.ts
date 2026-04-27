import { TransactionRepository } from '../infra/repositories/transaction-repository'
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case'
import { CreateTransactionController } from '../infra/http/controller/transaction.controller'

export function makeCreateTransactionController(): CreateTransactionController {
    const transactionRepository = new TransactionRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository)
    return new CreateTransactionController(createTransactionUseCase)
}
