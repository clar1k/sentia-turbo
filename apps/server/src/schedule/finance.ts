import { PriceModule } from "@/lib/modules/price";
import { appRouter } from "@/routers";
import { db } from "@/db";
import { financeSummary } from "@/db/schema";

const priceModule = new PriceModule();

export async function finance() {
  const coingeckoRes = await fetch("https://api.coingecko.com/api/v3/global");
  const coingeckoData = await coingeckoRes.json();
  const dropstabRes = await fetch(
    "https://extra-bff.dropstab.com/v1.2/market-data/market-total-and-widgets-summary?fields=stockRealtimeSPX%2CstockRealtimeGOLD",
  );
  const dropstabData = await dropstabRes.json();

  const btcDominance = coingeckoData?.data?.market_cap_percentage?.btc;
  const totalVolumeUsd = coingeckoData?.data?.total_volume?.usd;
  const tokenPrices = await priceModule.getPrices(priceModule.getTopCoins());
  const spxPrice = dropstabData?.data?.stockRealtimeSPX?.stockMarket?.price;
  const goldPrice = dropstabData?.data?.stockRealtimeGOLD?.stockMarket?.price;

  const tokenList = priceModule
    .getTopCoins()
    .map((symbol, index) => {
      const price = tokenPrices[symbol];
      const formattedPrice = price !== undefined ? `$${price}` : "N/A";
      return `${index + 1}. ${symbol.toUpperCase()}: ${formattedPrice}`;
    })
    .join("\n");

  const message = `
📊 **Market Summary**

- **BTC Dominance**: ${btcDominance.toFixed(2)}%
- **Total Market Volume**: $${Number(totalVolumeUsd).toLocaleString()}
- **S&P 500 (SPX)**: $${spxPrice.toFixed(2)}
- **Gold Price**: $${goldPrice.toFixed(2)}

💰 **Top 10 Tokens by Price**
${tokenList}

Based on the data above, provide a concise and insightful overview of the current crypto and broader market conditions. Highlight any notable trends or shifts in BTC dominance, overall trading volume, and correlations with traditional markets (SPX, gold).

Then, deliver short-term predictions for:
- 📅 **Today**
- 📈 **Next 7 Days**
- 📆 **Next 30 Days**

Do not ask for further input or clarification. The output should be standalone, clear, and actionable.
    `.trim();

  console.log(message);

  const result = await appRouter
    .createCaller({ session: null })
    .prompt({ message });
  if (result.ok) {
    const text = result?.text?.value?.text;
    console.log("✅ ChatGPT Insight:", text);
    await db.insert(financeSummary).values({ messages: text });
    return text;
  } else {
    console.error("❌ Prompt Error:", result);
    return "please try again";
  }
}
