import { CategoryDto, CreateCategoryDto } from '../../domain/entities/category.entity'

export interface CategoryRepositoryPorts {
    create(data: CreateCategoryDto): Promise<CategoryDto>
    findByNameAndUserId(name: string, userId: string): Promise<CategoryDto | null>
    findManyByUserId(userId: string): Promise<CategoryDto[]>
}
