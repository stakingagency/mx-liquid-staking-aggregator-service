import { Query, Resolver } from '@nestjs/graphql';

@Resolver('exchanges')
export class ExchangesResolver {
  @Query(() => [String], {
    name: 'exchanges',
    description: 'Get all supported exchanges',
  })
  getExchanges(): string[] {
    return [];
  }
}
