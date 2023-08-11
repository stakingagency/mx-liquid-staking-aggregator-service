import { Field, InputType, Int } from '@nestjs/graphql';
import { GenericIngestEntity_EXPERIMENTAL } from 'apps/ingester/src/entities/generic-ingest-experimental.entity';
import moment from 'moment';

@InputType()
export class GenericIngestInput {
  @Field(() => Int, { nullable: false })
  timestamp!: number;

  @Field({ nullable: false })
  series!: string;

  @Field({ nullable: false })
  key!: string;

  @Field({ nullable: false })
  value!: string;

  static generateEntity(
    input: GenericIngestInput,
  ): GenericIngestEntity_EXPERIMENTAL {
    return new GenericIngestEntity_EXPERIMENTAL({
      timestamp: moment.unix(input.timestamp).toDate(),
      series: input.series,
      key: input.key,
      value: input.value,
    });
  }
}
