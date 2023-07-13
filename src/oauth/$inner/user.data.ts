import { Entity, PrimaryGeneratedColumn, Column, Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '$share/typeorm';

@Entity('oauth_user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: null })
  avatar: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}

export interface UserRepository extends TypeOrmRepository<UserEntity> { }

@Repository(UserEntity)
export class UserRepository { }
