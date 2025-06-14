import redstone from "redstone-api";

export class PriceModule {
  redstoneConfig = { provider: "redstone" };

  //packageId == ticker
  async getPrice(packageId: string, raw = false) {
    const priceData = await redstone.getPrice(packageId, this.redstoneConfig);
    return raw ? priceData : priceData.value;
  }

  async getPrices(packageIds: string[], raw = false) {
    const priceData = await redstone.getPrice(packageIds, this.redstoneConfig);
    return Object.fromEntries(
      Object.entries(priceData).map(([key, value]) => {
        return [key, raw ? value : value.value];
      }),
    );
  }

  getTopCoins() {
    // hardcoded for now
    return ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "TRX", "ADA"];
    return [
      "BTC",
      "ETH",
      "XRP",
      "BNB",
      "SOL",
      "DOGE",
      "TRX",
      "ADA",
      "HYPE",
      "SUI"
    ]
  }
}
