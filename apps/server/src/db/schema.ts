import { pgTable, serial, text, timestamp, enum, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  wallet: text('wallet').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contextData = pgTable('contexts', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  type: text('type').notNull(),
  data: jsonb('daat').notNull(),
})

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  messages: jsonb('messages').notNull(),
  metadata: jsonb('jsonb').notNull(),
})