import { Module } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { TimescaleModule } from "@libs/timescaledb";
import { ApiConfigModule, DynamicModuleUtils } from "@libs/common";

@Module({
  imports: [
    ApiConfigModule,
    TimescaleModule,
    DynamicModuleUtils.getElasticModule(),
  ],
  providers: [
    QuotesService,
  ],
  exports: [
    QuotesService,
  ],
})
export class QuotesModule { }
