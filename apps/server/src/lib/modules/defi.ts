import axios from "axios";

const defillamaApiUrl = "https://api.llama.fi/";
const client = axios.create({
  baseURL: defillamaApiUrl,
  timeout: 10000,
});

interface ProtocolDataType {
  timestamp: number;
  protocols: Record<string, any>[];
}

let cachedProtocolsData: ProtocolDataType | null = null;

function filterKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export class DeFiModule {
  defaultProtocols = [
    "aave-v3",
    "lido",
    "eigenlayer",
    "ether.fi-stake",
    "sparklend",
    "ethena-usde",
    "uniswap-v3",
    "uniswap-v4",
    "pendle",
    "morpho-blue",
  ];

  async getProtocolsData(): Promise<Record<string, any>[]> {
    const deadline = 30 * 60 * 60 * 1000;
    if (
      !cachedProtocolsData ||
      cachedProtocolsData.timestamp + deadline > Date.now()
    ) {
      const protocols = (await client
        .get("/protocols")
        .then((resp) => resp.data)) as Record<string, any>[];
      const filteredProtocols = protocols.map((protocol) =>
        filterKeys(protocol, [
          "name",
          "description",
          "url",
          "logo",
          "category",
          "twitter",
          "slug",
          "tvl",
          "change_7d",
        ]),
      );
      cachedProtocolsData = {
        protocols: filteredProtocols,
        timestamp: Date.now(),
      };
    }
    return cachedProtocolsData.protocols;
  }

  async getChainsTvl(): Promise<Record<string, any>[]> {
    const chains = (await client
      .get("/v2/chains")
      .then((resp) => resp.data)) as Record<string, any>[];
    const filteredChains = chains
      .sort((a, b) => b.tvl - a.tvl)
      .map((chain) => filterKeys(chain, ["tvl", "name", "chainId"]));
    return filteredChains;
  }

  async calculateTotalTvl() {
    const protocolsData = await this.getChainsTvl();
    return protocolsData.reduce((prev, val) => prev + val.tvl, 0);
  }

  async getDefaultProtocols() {
    return (await this.getProtocolsData()).filter((obj) =>
      this.defaultProtocols.includes(obj.slug),
    );
  }
}
