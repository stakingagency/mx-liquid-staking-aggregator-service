import { Column, EntityTarget, PrimaryGeneratedColumn } from 'typeorm';
import BigNumber from 'bignumber.js';

export class IngestEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ nullable: false, type: 'timestamp without time zone' })
  timestamp: Date = new Date();

  @Column({ nullable: false })
  series: string = '';

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

  constructor(init?: Partial<IngestEntity>) {
    Object.assign(this, init);
  }

  public static fromObject(timestamp: Date, object: Record<string, Record<string, string | number | BigNumber>>): IngestEntity[] {
    const entities = Object.entries(object)
      .map(([series, record]) => IngestEntity.fromRecord(timestamp, record, series))
      .flat(1);
    return entities;
  }

  private static fromRecord(timestamp: Date, record: Record<string, string | number | BigNumber>, series: string): IngestEntity[] {
    const entities = Object.entries(record).map(([key, value]) => {
      const entity = new IngestEntity();
      entity.timestamp = timestamp;
      entity.series = series;
      entity.key = key;
      entity.value = new BigNumber(value).toFixed();
      return entity;
    });
    return entities;
  }

  public static getName<T extends IngestEntity>(entityTarget: EntityTarget<T>): string {
    try {
      const name = entityTarget.toString();
      const regex = /class (.*) extends/g.exec(name);
      return regex && regex.length > 1 ? regex[1] : '';
    } catch {
      return '';
    }
  }
}
