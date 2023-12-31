import { AuthModule } from '$share/auth';
import { env, Env } from '$share/env';
import { TypeOrmModule } from '@cellularjs/typeorm';
import { Module } from '@cellularjs/di';
import { EnvModule } from '@cellularjs/env';
import { getLogger } from '@cellularjs/logger';

@Module({
  exports: [
    EnvModule.config({ token: Env }),
    AuthModule,
    TypeOrmModule.initialize({
      type: 'postgres',
      host: env().DB_HOST,
      port: env().DB_PORT,
      username: env().DB_USER,
      password: env().DB_PASSWORD,
      database: env().DB_NAME,
      schema: env().DB_SCHEMA_NAME,
      synchronize: false,
    }),
  ],
})
export class CommonModule {
  onInit() {
    getLogger(CommonModule.name).info('initialized');
  }
}
