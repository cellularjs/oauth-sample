import { env as cllEnv } from '@cellularjs/env';

export class Env {
  NODE_PORT: string;
  SYS_SECRET: string;
  DB_URL: string;
}

export const env = cllEnv<Env>;
