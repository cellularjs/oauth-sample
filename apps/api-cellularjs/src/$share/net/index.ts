import { NetworkConfig } from '@cellularjs/net';
import { OAuth } from 'oauth';

export const netCnfs: NetworkConfig = [
  { name: OAuth.name, driver: OAuth },
];
