import { Module } from '@nestjs/common';
import { ExchangesResolver } from './exchanges.resolver';
@Module({
  imports: [],
  providers: [ExchangesResolver],
  exports: [],
})
export class ExchangesResolverModule {}
