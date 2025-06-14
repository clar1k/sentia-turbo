import {useEffect, useState} from "react";
type ChainTVLs = Record<string, number>;


export function totalTVL() {
  const [currentChainTvls, setCurrentChainTvls] = useState<ChainTVLs>({});
  const [totalTVL, setTotalTVL] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTvl = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.llama.fi/updatedProtocol/aave", {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data = await res.json();
        const tvls: ChainTVLs = data?.currentChainTvls || {};
        const total = Object.values(tvls).reduce((sum, val) => sum + val, 0);

        setCurrentChainTvls(tvls);
        setTotalTVL(total);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTvl();
  }, []);

  return {totalTVL, currentChainTvls};
}