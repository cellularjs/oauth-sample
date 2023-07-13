import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('oauth_token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  tokenValue: string;

  /**
   * Timestamp in second.
   */
  @Column()
  expIn: number;
}

export interface TokenRepository extends TypeOrmRepository<TokenEntity> { }

@Repository(TokenEntity)
export class TokenRepository { }
