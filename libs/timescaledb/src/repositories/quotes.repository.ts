import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteCoinEntity } from '../entities';

@Injectable()
export class QuotesRepository {
  constructor(
    @InjectRepository(QuoteCoinEntity)
    private readonly coinsRepository: Repository<QuoteCoinEntity>,
  ) { }

  // TODO add metrics decorator
  getSupportedCoins(): Promise<any[]> {
    return this.coinsRepository.find();
  }
}
