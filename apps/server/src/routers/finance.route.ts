import {Hono} from "hono";
import {PriceModule} from "@/lib/modules/price";

const priceModule = new PriceModule();


export const financeRoute = new Hono()
  .get('/price', async(ctx) => {
    const tokenPrices = await priceModule.getPrices(priceModule.getTopCoins());
    return ctx.json({ok: true, tokenPrices}, 200);
  })