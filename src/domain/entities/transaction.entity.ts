import { z } from 'zod'

export const transactionSchema = z.object({
    id: z.uuid(),
    title: z.string().min(2).max(100),
    userId: z.uuid(),
    description: z.string().nullable().optional(),
    categoryId: z.uuid().nullable().optional(),
    // Valor monetario fica como string para evitar perda de precisao.
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid monetary value'),
    date: z.coerce.date(),
    type: z.enum(['income', 'expense']),
    created_at: z.date(),
    updated_at: z.date(),
})

export const createTransactionSchema = transactionSchema.pick({
    title:true,
    amount:true,
    type:true,
    date: true,
    description:true,
    categoryId:true,
    userId:true
})

export type TransactionDto = z.infer<typeof transactionSchema>
export type CreateTransactionDto = z.infer<typeof createTransactionSchema>

export type ResponseTransactionDto = TransactionDto
