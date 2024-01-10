import * as path from 'path';
import { DataSource } from 'typeorm';
import { EnvModule } from '@cellularjs/env';
import { Env, env } from '$share/env';

EnvModule.config({ token: Env });

export const dataSource = new DataSource({
  type: 'postgres',
  url: env().DB_URL,
  migrations: [
    path.resolve(__dirname, 'database/migrations/*.ts'),
  ],
});
