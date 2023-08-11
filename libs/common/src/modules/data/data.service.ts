import { Injectable, Logger } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { GenericIngestInput } from './data.models';
import { IngestTableEnum } from 'libs/timescaledb/src/entities/ingest-table.enum';
import { TimescaleWriteService } from 'libs/timescaledb/src';
import { ContextUtils } from '../../utils/context.utils';

@Injectable()
export class DataService {
  private readonly logger: Logger;

  constructor(private readonly timescaleWriteService: TimescaleWriteService) {
    this.logger = new Logger(DataService.name);
  }

  public async ingestData(
    table: IngestTableEnum,
    inputs: GenericIngestInput[],
  ): Promise<boolean> {
    try {
      const consumer = ContextUtils.getConsumer();

      this.logger.log(
        `Address ${consumer?.apiUser?.address} started ingesting ${
          inputs.length
        } rows on table '${table}': ${JSON.stringify(inputs)}`,
      );

      const insertResult = await this.timescaleWriteService.writeGenericData(
        table,
        inputs,
        true,
      );
      return insertResult;
    } catch (error: any) {
      throw new ApolloError(error);
    }
  }
}
