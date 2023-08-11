import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";

export enum ExchangeType {
  EXCHANGE = "exchange",
  ONRAMP = "onramp"
}

registerEnumType(ExchangeType, { name: 'ExchangeType' });

@ObjectType()
export class Exchange {
  @Field(() => String, { nullable: false })
  identifier: string = '';

  @Field(() => String, { nullable: false })
  name: string = '';

  @Field(() => ExchangeType, { nullable: false })
  type: ExchangeType = ExchangeType.EXCHANGE;

  @Field(() => [String], { nullable: false })
  addresses: string[] = [];
}
