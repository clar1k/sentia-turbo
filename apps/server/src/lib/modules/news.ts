import axios from 'axios';

const coinDeskApi = "https://data-api.coindesk.com/"
const client = axios.create({
  baseURL: coinDeskApi,
  timeout: 10000,
});

let globalsNewsCache: object[] = [];

function arrayDiff(arr1: any[], arr2: any[], key: string) {
  const arr2Mapped = arr2.map(i => i[key]);
  const keys = arr1.map(i => i[key]).filter(item => !arr2Mapped.includes(item));
  return arr1.filter((val, i) => val[key] === keys[i]);
}

export class NewsModule {
  async fetchLastNews(): Promise<object[]> {
    const response = await client.get("news/v1/article/list", {
      params: {
        limit: 5,
        lang: "EN",
      }
    });
    return response.data["Data"];
  }

  async fetchNewNews(): Promise<Record<string, any>[]> {
    const latestNews = await this.fetchLastNews();
    const difference = arrayDiff(latestNews, globalsNewsCache, "ID");

    if (difference.length > 0) {
      globalsNewsCache = [...globalsNewsCache, ...difference];
    }

    return difference;
  }
}

const news = new NewsModule();
