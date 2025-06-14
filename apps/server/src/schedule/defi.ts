import { appRouter } from "@/routers";
import { db } from "@/db";
import { defiSummary, financeSummary } from "@/db/schema";

export async function defi() {
  const totalDexVolumeResponse = await fetch(
    "https://api.llama.fi/overview/dexs?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    },
  );
  let data = await totalDexVolumeResponse.json();
  const totalDexVolume = data.totalAllTime;

  const totalTVLResponse = await fetch(
    "https://api.llama.fi/updatedProtocol/aave",
    {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    },
  );
  data = await totalTVLResponse.json();
  const currentChainTvls: Record<string, number> = data?.currentChainTvls;
  const totalTVL = Object.values(currentChainTvls).reduce(
    (sum, val) => sum + val,
    0,
  );

  const message = `
📈 **DeFi Market Snapshot**

- **Total DEX Volume (All-Time)**: $${Number(totalDexVolume).toLocaleString()}
- **Total Aave TVL Across Chains**: $${Number(totalTVL).toLocaleString()}



Using the data above, provide a concise market summary of the current DeFi landscape. Focus on:
- Recent trends in decentralized exchange (DEX) activity
- The distribution and significance of Aave's total value locked (TVL) across chains

Then, based on this analysis, offer short-term forecasts for DeFi performance:
- 📅 **Today**
- 📈 **Next 7 Days**
- 📆 **Next 30 Days**

Your response should be clear and insight-driven. Avoid asking for additional input or clarification.
Do not ask for additional input or clarification.
  `.trim();

  console.error("totalDevVolume:", totalDexVolume);
  console.error("totalTVL:", totalTVL);
  console.error("currentChainTvls", currentChainTvls);

  const query = await appRouter
    .createCaller({ user: null, dynamicPayload: null })
    .prompt({ message });

  if (query.ok) {
    const text = query?.text?.value?.text;
    console.log("✅ ChatGPT Insight:", text);
    await db.insert(defiSummary).values({ messages: text });
    return text;
  } else {
    console.error("❌ Prompt Error:", query);
    return "please try again";
  }
}
