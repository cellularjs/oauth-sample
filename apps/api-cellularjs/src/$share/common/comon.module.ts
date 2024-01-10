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
      url: env().DB_URL,
      synchronize: false,
    }),
  ],
})
export class CommonModule {
  onInit() {
    getLogger(CommonModule.name).info('initialized');
  }
}
