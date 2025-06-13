CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"messages" jsonb NOT NULL,
	"jsonb" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contexts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"daat" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_wallet_unique" UNIQUE("wallet")
);
