import { CellularConfig } from '@cellularjs/cli';
// import * as nodeExternals from 'webpack-node-externals';

const cellularConfig: CellularConfig = {
  entry: {
    http: './src/$app/http/index.ts',
  },
  // webpack(config) {
  //   // override exist nodeExternals
  //   config.externals = [
  //     nodeExternals({
  //       allowlist: [/@sdks/],
  //     }),
  //   ];

  //   return config;
  // },
};

export default cellularConfig;
