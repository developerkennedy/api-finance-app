import { ListCategoriesUseCase } from '../application/use-cases/list-categories.use-case'
import { ListCategoriesController } from '../infra/http/controller/list-categories.controller'
import { CategoriesRepository } from '../infra/repositories/categories-repository'

export function makeListCategoriesController(): ListCategoriesController {
    const categoriesRepository = new CategoriesRepository()
    const listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepository)
    return new ListCategoriesController(listCategoriesUseCase)
}
