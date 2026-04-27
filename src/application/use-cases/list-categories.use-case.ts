import { CategoryDto } from '../../domain/entities/category.entity'
import { CategoryRepositoryPorts } from '../ports/category-repository.ports'

export class ListCategoriesUseCase {
    constructor(private readonly categoryRepository: CategoryRepositoryPorts) {}

    async execute(userId: string): Promise<CategoryDto[]> {
        return this.categoryRepository.findManyByUserId(userId)
    }
}
