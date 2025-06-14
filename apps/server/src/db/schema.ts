import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  wallet: text('wallet').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersWallet = pgTable('usersWallets', {
  id: serial('id').primaryKey(),
  address: text('address').notNull(),
  privateKey: text('privateKey').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer('user_id').notNull().references(() => users.id),
})

export const contextData = pgTable('contexts', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  type: text('type').notNull(),
  data: jsonb('data').notNull(),
})

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  messages: jsonb('messages').notNull(),
  metadata: jsonb('jsonb').notNull(),
})

export const financeSummary = pgTable('finance_summary', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  messages: text().notNull()
})