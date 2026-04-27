import {TransactionRepositoryPort} from "../../application/ports/transaction-repository.ports";
import {CreateTransactionDto, ResponseTransactionDto} from "../../domain/entities/transaction.entity";
import {PaginatedResult, PaginationParams} from "../../domain/entities/pagination.entity";
import {db} from "../database/client";
import {transactions} from "../database/schema";
import {and, asc, count, eq} from "drizzle-orm";

export class TransactionRepository implements TransactionRepositoryPort{
    async create(data: CreateTransactionDto): Promise<ResponseTransactionDto> {
        const [transaction] = await db.insert(transactions).values(data).returning()
        return transaction
    }

    async findByIdAndUserId(userId: string, id: string): Promise<ResponseTransactionDto | null> {
        const transaction = await db.query.transactions.findFirst({
            where: and(eq(transactions.id, id), eq(transactions.userId, userId)),
        })
        return transaction ?? null
    }

    async findManyByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<ResponseTransactionDto>> {
        const page = params.page ?? 1
        const limit = params.limit ?? 20
        const offset = (page - 1) * limit

        const [data, [{ total }]] = await Promise.all([
            db.query.transactions.findMany({
                where: eq(transactions.userId, userId),
                orderBy: asc(transactions.date),
                limit,
                offset,
            }),
            db.select({ total: count() }).from(transactions).where(eq(transactions.userId, userId)),
        ])

        return {
            data,
            total: Number(total),
            page,
            limit,
            totalPages: Math.ceil(Number(total) / limit),
        }
    }

    async deleteByIdAndUserId(userId: string, id: string): Promise<void> {
        await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    }

    async updateByIdAndUserId(userId: string, id: string, data: Partial<CreateTransactionDto>): Promise<ResponseTransactionDto | null> {
        const [transaction] = await db
            .update(transactions)
            .set(data)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning()
        return transaction ?? null
    }
}
