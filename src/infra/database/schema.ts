import {pgTable, uuid, text, timestamp, index, varchar, numeric, pgEnum} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


const timestamps = {
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
}

export const users = pgTable('users',{
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name',{length:122}).notNull(),
    email: varchar('email',{length:255}).notNull().unique(),
    password: varchar('password',{length:255}).notNull(),
    ...timestamps
},(t) => [
    index('name_idx').on(t.name),
])

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense'])

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...timestamps
}, (t) => [
    index('categories_user_id_idx').on(t.userId),
    index('categories_user_name_idx').on(t.userId, t.name),
])

export const transactions = pgTable('transactions',{
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title',{length:256}).notNull(),
    description: text('description'),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    type: transactionTypeEnum('type').notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null', onUpdate: 'cascade' }),
    date: timestamp('date').notNull(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...timestamps
},(t) => [
    index('transactions_user_id_idx').on(t.userId),
    index('transactions_date_idx').on(t.date),
    index('transactions_type_idx').on(t.type),
    index('transactions_user_date_idx').on(t.userId, t.date),
    index('transactions_category_id_idx').on(t.categoryId),
])

export const RefreshToken = pgTable('refresh_token',{
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id,{onDelete:'cascade', onUpdate:'cascade'} ),
    token_hash: varchar('token_hash',{length:64}).notNull(),
    expires_at_revoke: timestamp('expires_at_revoke').notNull(),
    ...timestamps
},(t) => [
    index('refresh_token_hash_idx').on(t.token_hash),
    index('refresh_token_user_id_idx').on(t.userId),
])

export const usersRelations = relations(users, ({ many }) => ({
    categories: many(categories),
    transactions: many(transactions),
    refreshTokens: many(RefreshToken),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    user: one(users, {
        fields: [categories.userId],
        references: [users.id],
    }),
    transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}));

export const refreshTokenRelations = relations(RefreshToken, ({ one }) => ({
    user: one(users, {
        fields: [RefreshToken.userId],
        references: [users.id],
    }),
}));