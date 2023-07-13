import * as path from 'path';
import { DataSource } from 'typeorm';
import { EnvModule } from '@cellularjs/env';
import { Env, env } from '$share/env';

EnvModule.config({ token: Env });

export const dataSource = new DataSource({
  type: "postgres",
  host: env().DB_HOST,
  port: env().DB_PORT,
  username: env().DB_USER,
  password: env().DB_PASSWORD,
  database: env().DB_NAME,
  schema: env().DB_SCHEMA_NAME,
  migrations: [
    path.resolve(__dirname, 'database/migrations/*.ts'),
  ],
});
