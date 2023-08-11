import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('api_users')
@Index(['address'])
export class ApiUserEntity {
  @PrimaryColumn()
  address: string = '';

  @Column({ nullable: true })
  host?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: false, default: false })
  read: boolean = false;

  @Column({ nullable: false, default: false })
  write: boolean = false;

  constructor(init?: Partial<ApiUserEntity>) {
    Object.assign(this, init);
  }
}
