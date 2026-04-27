import { UsersRepository } from '../infra/repositories/users-repository'
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case'
import { CreateUserController } from '../infra/http/controller/create-user.controller'

export function makeRegisterController(): CreateUserController {
    const userRepository = new UsersRepository()
    const createUserUseCase = new CreateUserUseCase(userRepository)

    return new CreateUserController(createUserUseCase)
}
