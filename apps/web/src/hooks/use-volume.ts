import { useQuery } from "@tanstack/react-query";

export function useGlobalVolume() {
  const {
    data: volumeUsd,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["globalVolume"],
    queryFn: async (): Promise<number | null> => {
      const res = await fetch("https://api.coingecko.com/api/v3/global");

      if (!res.ok) {
        throw new Error(`Failed to fetch global volume: ${res.status}`);
      }

      const json = await res.json();
      return json?.data?.total_volume?.usd ?? null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    volumeUsd: volumeUsd ?? null,
    loading,
    error: error?.message ?? null,
  };
}
