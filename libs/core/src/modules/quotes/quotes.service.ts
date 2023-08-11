import { Injectable } from "@nestjs/common";
import { QuotesRepository } from "@libs/timescaledb";

@Injectable()
export class QuotesService {
  // private readonly logger = new OriginLogger(QuotesService.name);

  constructor(
    private readonly quotesRepository: QuotesRepository,
  ) { }

  public async getSupportedCoins(): Promise<string[]> {
    return await this.quotesRepository.getSupportedCoins();
  }
}
