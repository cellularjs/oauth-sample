import { clearNetwork } from '@cellularjs/net';
import { destroyAllDataSource } from '@cellularjs/typeorm';
import * as supertest from 'supertest';
import { initApp } from '$app/http/app';

beforeEach(async () => {
  global.server = (await initApp()).listen();
  global.testAgent = supertest(global.server);
});

afterEach(async () => {
  await destroyAllDataSource();
  await clearNetwork();
  global.server.close();
});
