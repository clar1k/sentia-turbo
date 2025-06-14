import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export function usePrices() {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery(trpc.finance.getPrice.queryOptions());

  return {
    prices: data?.tokenPrices ?? null,
    loading,
    error: error?.message ?? null,
  };
}
