import {Hono} from "hono";
import {PriceModule} from "@/lib/modules/price";
import {db} from "@/db";
import {financeSummary} from "@/db/schema";
import {desc} from "drizzle-orm";

const priceModule = new PriceModule();


export const financeRoute = new Hono()
  .get('/price', async(ctx) => {
    const tokenPrices = await priceModule.getPrices(priceModule.getTopCoins());
    return ctx.json({ok: true, tokenPrices}, 200);
  })
.get('/ai-summary', async(ctx) => {
  const message = await db.select().from(financeSummary).orderBy(desc(financeSummary.createdAt)).limit(1);
  return ctx.json({ok: true, message}, 200);
})