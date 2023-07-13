import { Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';
import { TokenRepository } from 'oauth/$inner/token.data';
import { UserResetPwdReq } from './reset-pwd.req';

@Transactional()
@Service({ scope: 'publish' })
export class UserResetPwdCmd implements ServiceHandler {
  constructor(
    private resetPwdReq: UserResetPwdReq,
    private userRepo: UserRepository,
    private ssoTokenRepo: TokenRepository,
  ) { }

  async handle() {
    const { resetPwdReq, userRepo, ssoTokenRepo } = this;

    const token = await ssoTokenRepo.findOneBy({ id: resetPwdReq.nonce });
    if (!token) {
      throw Unprocessable({ msg: t('oauth.err.token_expired') });
    }

    const isExpired = token.expIn < (Date.now() / 1000);
    if (isExpired) {
      throw Unprocessable({ msg: t('oauth.err.token_expired') });
    }

    const isTokenMatched = await crypto.compare(resetPwdReq.token, token.tokenValue);
    if (!isTokenMatched) {
      throw Unprocessable({ msg: t('oauth.err.token_expired') });
    }

    await ssoTokenRepo.remove(token);

    const hashedPwd = await crypto.hash(resetPwdReq.newPwd);
    await userRepo.update(
      { id: token.userId },
      { password: hashedPwd },
    );
  }
}