import { APIError } from '../../domain/errors/errors'
import { CategoryDto } from '../../domain/entities/category.entity'
import { CategoryRepositoryPorts } from '../ports/category-repository.ports'

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: CategoryRepositoryPorts) {}

    async execute(data: { name: string; userId: string }): Promise<CategoryDto> {
        const categoryAlreadyExists = await this.categoryRepository.findByNameAndUserId(data.name, data.userId)

        if (categoryAlreadyExists) {
            throw new APIError('Category already exists for this user')
        }

        return this.categoryRepository.create({
            name: data.name,
            userId: data.userId,
        })
    }
}
