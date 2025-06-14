import {Hono} from "hono";
import {PriceModule} from "@/lib/modules/price";
import {db} from "@/db";
import {financeSummary} from "@/db/schema";
import {desc} from "drizzle-orm";
import { protectedProcedure, router } from "@/lib/trpc";
import { type } from "arktype";

const priceModule = new PriceModule();


export const financeRoute = router({
    "ai-summary": protectedProcedure
      .input(type({}))
      .mutation(async ({ ctx }) => {
        const message = await db.select().from(financeSummary).orderBy(desc(financeSummary.createdAt)).limit(1);
        return { ok: true, message };
      })
  }
)