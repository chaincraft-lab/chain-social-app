import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ProtocolMetrics {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  tvl?: number;
}

export interface CoinGeckoResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_24h_vol: number;
  };
}

export interface DefiLlamaProtocol {
  id: string;
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string;
  gecko_id: string;
  cmcId: string;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  forked_from: string[];
  oracles: string[];
  language: string;
  listed_at: number;
  slug: string;
  tvl: number;
  chainTvls: { [chain: string]: number };
  change_1h: number;
  change_1d: number;
  change_7d: number;
  tokenBreakdowns: { [token: string]: number };
  mcap: number;
}

@Injectable()
export class CryptoApiService {
  private readonly logger = new Logger(CryptoApiService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * CoinGecko API'den token fiyat bilgilerini çeker
   */
  async getTokenPrice(tokenIds: string[]): Promise<CoinGeckoResponse | null> {
    try {
      const ids = tokenIds.join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price`;
      const params = {
        ids,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_market_cap: 'true',
        include_24hr_vol: 'true',
      };

      const response = await firstValueFrom(
        this.httpService.get(url, { params })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`CoinGecko API error: ${error.message}`);
      return null;
    }
  }

  /**
   * DeFiLlama API'den protokol TVL bilgilerini çeker
   */
  async getProtocolTVL(protocolSlug: string): Promise<number | null> {
    try {
      const url = `https://api.llama.fi/protocol/${protocolSlug}`;
      const response = await firstValueFrom(this.httpService.get(url));
      
      if (response.data && response.data.currentChainTvls) {
        // Tüm chain'lerdeki TVL'leri topla
        const tvlSum = Object.values(response.data.currentChainTvls).reduce(
          (total: number, tvl: unknown) => total + (typeof tvl === 'number' ? tvl : 0), 
          0
        ) as number;
        return tvlSum;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`DeFiLlama API error: ${error.message}`);
      return null;
    }
  }

  /**
   * DeFiLlama API'den tüm protokolleri çeker
   */
  async getAllProtocols(): Promise<DefiLlamaProtocol[] | null> {
    try {
      const url = 'https://api.llama.fi/protocols';
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.logger.error(`DeFiLlama protocols API error: ${error.message}`);
      return null;
    }
  }

  /**
   * Protokol için kombine metrikler
   */
  async getProtocolMetrics(
    tokenId?: string, 
    protocolSlug?: string
  ): Promise<ProtocolMetrics> {
    const metrics: ProtocolMetrics = {};

    // CoinGecko'dan fiyat bilgileri
    if (tokenId) {
      const priceData = await this.getTokenPrice([tokenId]);
      if (priceData && priceData[tokenId]) {
        const data = priceData[tokenId];
        metrics.price = data.usd;
        metrics.priceChange24h = data.usd_24h_change;
        metrics.marketCap = data.usd_market_cap;
        metrics.volume24h = data.usd_24h_vol;
      }
    }

    // DeFiLlama'dan TVL bilgileri
    if (protocolSlug) {
      const tvl = await this.getProtocolTVL(protocolSlug);
      if (tvl) {
        metrics.tvl = tvl;
      }
    }

    return metrics;
  }

  /**
   * Popüler protokollerin listesini çeker
   */
  async getTrendingProtocols(limit: number = 10): Promise<DefiLlamaProtocol[]> {
    try {
      const protocols = await this.getAllProtocols();
      if (!protocols) return [];

      // TVL'ye göre sırala ve limit uygula
      return protocols
        .filter(p => p.tvl > 0)
        .sort((a, b) => b.tvl - a.tvl)
        .slice(0, limit);
    } catch (error) {
      this.logger.error(`Trending protocols error: ${error.message}`);
      return [];
    }
  }
}