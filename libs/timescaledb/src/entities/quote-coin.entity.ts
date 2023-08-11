import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('quote_coins')
@Index(['identifier'])
@Index(['dbIdentifier'])
export class QuoteCoinEntity {
  @PrimaryColumn({ nullable: false })
  identifier: string = '';

  @Column({ nullable: false })
  apiIdentifier: string = '';

  @Column({ nullable: false })
  dbIdentifier: string = '';

  @Column({ type: 'timestamp without time zone', nullable: false })
  lastFetch: Date = new Date();

  constructor(init?: Partial<QuoteCoinEntity>) {
    Object.assign(this, init);
  }
}
