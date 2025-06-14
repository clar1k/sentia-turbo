import { useQuery } from "@tanstack/react-query";

export interface StockMarket {
  price: number;
  currencyType: string;
  updateTime: number;
}

export interface StockData {
  marketStatus: boolean;
  stockMarket: StockMarket;
  change: number;
}

export interface MarketResponse {
  stockRealtimeSPX: StockData;
  stockRealtimeGOLD: StockData;
}

export function useMarketData() {
  const {
    data: marketData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["marketData"],
    queryFn: async (): Promise<MarketResponse> => {
      const res = await fetch(
        "https://extra-bff.dropstab.com/v1.2/market-data/market-total-and-widgets-summary?fields=stockRealtimeSPX%2CstockRealtimeGOLD",
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch market data: ${res.status}`);
      }

      const json = await res.json();

      if (!json.ok) {
        throw new Error(json.message || "Failed to fetch market data");
      }

      return json.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    marketData: marketData ?? null,
    loading,
    error: error?.message ?? null,
  };
}
