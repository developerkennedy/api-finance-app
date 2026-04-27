import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case'
import { CreateCategoryController } from '../infra/http/controller/category.controller'
import { CategoriesRepository } from '../infra/repositories/categories-repository'

export function makeCreateCategoryController(): CreateCategoryController {
    const categoriesRepository = new CategoriesRepository()
    const createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository)
    return new CreateCategoryController(createCategoryUseCase)
}
