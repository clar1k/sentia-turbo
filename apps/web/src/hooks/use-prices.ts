import { useEffect, useState } from "react";

export function usePrices() {
  const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;
  const [prices, setPrices] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log("API_BASE_URL:", API_BASE_URL);
        const res = await fetch(`${API_BASE_URL}/finance/price`);
        const data = await res.json();
        setPrices(data);
        console.log("Prices data:", data);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        setError("Failed to fetch prices");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [API_BASE_URL]);

  return { prices, loading, error };
}
