import axios, { type AxiosInstance } from 'axios';

export class DeFiModule {
  defillamaApiUrl = 'https://api.llama.fi/';
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.defillamaApiUrl,
      timeout: 10000,
    })
  }

  getProtocolsData() {
    return {};
  }
}