import { useQuery } from "@tanstack/react-query";

export function useBtcDominance() {
  const {
    data: btcDominance,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["btcDominance"],
    queryFn: async (): Promise<number | null> => {
      const res = await fetch(
        "https://api2.icodrops.com/portfolio/api/marketTotal/last",
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch BTC dominance: ${res.status}`);
      }

      const json = await res.json();
      const dominanceValue = json.btcDominance;

      // Ensure we return a number or null
      if (dominanceValue === null || dominanceValue === undefined) {
        return null;
      }

      const parsedValue =
        typeof dominanceValue === "string"
          ? parseFloat(dominanceValue)
          : dominanceValue;

      return isNaN(parsedValue) ? null : parsedValue;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    btcDominance: btcDominance ?? null,
    loading,
    error: error?.message ?? null,
  };
}
