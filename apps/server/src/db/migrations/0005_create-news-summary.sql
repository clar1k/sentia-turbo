CREATE TABLE "news_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"original_data" jsonb NOT NULL,
	"summary" text NOT NULL
);
