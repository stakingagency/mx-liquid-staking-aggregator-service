import { Module } from '@nestjs/common';
import { ExchangesResolverModule } from './exchanges';

@Module({
  imports: [ExchangesResolverModule],
  exports: [ExchangesResolverModule],
})
export class ResolversModule {}
