import { useEffect, useState } from 'react';

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
  const [marketData, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(
          'https://extra-bff.dropstab.com/v1.2/market-data/market-total-and-widgets-summary?fields=stockRealtimeSPX%2CstockRealtimeGOLD',
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        const json = await res.json();
        if (json.ok) {
          setData(json.data);
        } else {
          setError(json.message);
        }
      } catch (err) {
        setError('Failed to fetch market data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  return { marketData, loading, error };
}
