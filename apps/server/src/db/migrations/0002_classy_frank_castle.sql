CREATE TABLE "finance_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"messages" text NOT NULL
);
