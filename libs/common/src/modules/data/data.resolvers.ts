import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DataApiConsumer } from 'src/common/auth/entities';
import { IngestTableEnum } from 'src/common/entities/ingest-table.enum';
import { Consumer } from 'src/utils/decorators/consumer';
import { NativeAuthWriteGuard } from 'src/utils/guards/native.auth.guard';
import { DataApiQuery } from '../_internal/data-api.query';
import { GenericIngestInput } from './data.models';
import { DataService } from './data.service';

@Resolver()
@UseGuards(NativeAuthWriteGuard)
export class DataResolver {
  constructor(private readonly dataService: DataService) {}

  @Mutation(() => Boolean)
  @DataApiQuery()
  async ingestData(
    @Consumer() _caller: DataApiConsumer,
    @Args('table', { type: () => IngestTableEnum }) table: IngestTableEnum,
    @Args('input', { type: () => [GenericIngestInput] })
    inputs: GenericIngestInput[],
  ): Promise<boolean> {
    return await this.dataService.ingestData(table, inputs);
  }
}
