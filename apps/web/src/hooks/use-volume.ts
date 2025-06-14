import { useEffect, useState } from 'react';

export function useGlobalVolume() {
  const [volumeUsd, setVolumeUsd] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalVolume = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/global');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        const volume = json?.data?.total_volume?.usd ?? null;
        setVolumeUsd(volume);
      } catch (err) {
        console.error('Failed to fetch global volume:', err);
        setError('Failed to fetch global volume');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalVolume();
  }, []);

  return { volumeUsd, loading, error };
}
