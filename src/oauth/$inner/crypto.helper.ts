import * as nodeJsCrypto from 'crypto';

/**
 * Ref https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
 */
export const crypto = {
  hash(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.genRandomStr();

      nodeJsCrypto.scrypt(text, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  },
  compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');

      nodeJsCrypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(key == derivedKey.toString('hex'));
      });
    });
  },
  genRandomStr(size = 32) {
    return nodeJsCrypto.randomBytes(size).toString('hex');
  },
};
