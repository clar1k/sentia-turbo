import { useEffect, useState } from 'react';

export function useBtcDominance() {
  const [btcDominance, setBtcDominance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBtcDominance = async () => {
      try {
        const res = await fetch('https://api2.icodrops.com/portfolio/api/marketTotal/last');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        setBtcDominance(json.btcDominance ?? null);
      } catch (err) {
        console.error('Failed to fetch BTC dominance:', err);
        setError('Failed to fetch BTC dominance');
      } finally {
        setLoading(false);
      }
    };

    fetchBtcDominance();
  }, []);

  return { btcDominance };
}
