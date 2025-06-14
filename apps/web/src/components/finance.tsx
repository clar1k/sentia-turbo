import {useMarketData} from "@/hooks/use-market-data";
import {usePrices} from "@/hooks/use-prices";
import {useBtcDominance} from "@/hooks/use-btc-dominance";
import {useGlobalVolume} from "@/hooks/use-volume";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

export function FinanceTab() {
  const { prices} = usePrices();
  const { marketData } = useMarketData();
  const { btcDominance } = useBtcDominance();
  const { volumeUsd } = useGlobalVolume();

  console.error(volumeUsd);


  return (
    <>
      <div>
        YES BABY
      </div>
    </>
  )
}