import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '@cellularjs/typeorm';

@Entity('oauth_app')
export class AppEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column()
  website: string;

  @Column('simple-json', { nullable: true })
  redirectURIs: string[];

  @Column()
  logo: string;

  @Column()
  secret: string;

  @Column()
  ownerId: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}

export interface AppRepository extends TypeOrmRepository<AppEntity> { }

@Repository({ entity: AppEntity })
export class AppRepository { }
