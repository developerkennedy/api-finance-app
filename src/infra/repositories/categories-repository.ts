import { asc, and, eq } from 'drizzle-orm'
import { CategoryRepositoryPorts } from '../../application/ports/category-repository.ports'
import { CategoryDto, CreateCategoryDto } from '../../domain/entities/category.entity'
import { db } from '../database/client'
import { categories } from '../database/schema'

export class CategoriesRepository implements CategoryRepositoryPorts {
    async create(data: CreateCategoryDto): Promise<CategoryDto> {
        const [category] = await db.insert(categories).values(data).returning()
        return category
    }

    async findByNameAndUserId(name: string, userId: string): Promise<CategoryDto | null> {
        const category = await db.query.categories.findFirst({
            where: and(eq(categories.name, name), eq(categories.userId, userId)),
        })

        return category ?? null
    }

    async findManyByUserId(userId: string): Promise<CategoryDto[]> {
        return db.query.categories.findMany({
            where: eq(categories.userId, userId),
            orderBy: asc(categories.name),
        })
    }
}
