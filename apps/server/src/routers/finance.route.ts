import {Hono} from "hono";
import {PriceModule} from "@/lib/modules/price";
import {db} from "@/db";
import {financeSummary} from "@/db/schema";
import {desc} from "drizzle-orm";
import { protectedProcedure, router } from "@/lib/trpc";
import { type } from "arktype";

const priceModule = new PriceModule();


export const financeRouter = router({
  getPrice: protectedProcedure.query(async () => {
    const tokenPrices = await priceModule.getPrices(priceModule.getTopCoins());
    return { ok: true, tokenPrices };
  }),
  getAiSummary: protectedProcedure.query(async () => {
    const message = await db
      .select()
      .from(financeSummary)
      .orderBy(desc(financeSummary.createdAt))
      .limit(1);
    return { ok: true, message };
  }),
});