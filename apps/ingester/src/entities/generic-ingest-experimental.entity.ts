import { Column, Generated, PrimaryColumn } from 'typeorm';

export class GenericIngestEntity_EXPERIMENTAL {
  @Generated('increment')
  @Column()
  @PrimaryColumn()
  id: number = 0;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  @PrimaryColumn()
  timestamp: Date = new Date();

  @Column({ nullable: true })
  series?: string;

  @Column({ nullable: false })
  key: string = '';

  @Column({
    type: 'decimal',
    precision: 128,
    scale: 64,
    default: 0,
    nullable: false,
  })
  value: string = '0';

  constructor(init?: Partial<GenericIngestEntity_EXPERIMENTAL>) {
    Object.assign(this, init);
  }

  public static fromObject(
    timestamp: Date,
    object: Record<string, Record<string, string>>,
  ): GenericIngestEntity_EXPERIMENTAL[] {
    const entities = Object.entries(object)
      .map(([series, record]: [string, Record<string, string>]) =>
        GenericIngestEntity_EXPERIMENTAL.fromRecord(timestamp, record, series),
      )
      .flat(1);
    return entities;
  }

  private static fromRecord(
    timestamp: Date,
    record: Record<string, string>,
    series?: string,
  ): GenericIngestEntity_EXPERIMENTAL[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new GenericIngestEntity_EXPERIMENTAL();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = value;
      return entity;
    });
    return entities;
  }
}
