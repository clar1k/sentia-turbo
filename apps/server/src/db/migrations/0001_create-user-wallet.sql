CREATE TABLE "usersWallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"privateKey" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "contexts" RENAME COLUMN "daat" TO "data";--> statement-breakpoint
ALTER TABLE "contexts" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "usersWallets" ADD CONSTRAINT "usersWallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;