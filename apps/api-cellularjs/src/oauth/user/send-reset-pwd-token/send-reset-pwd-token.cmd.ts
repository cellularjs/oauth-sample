import { Service, ServiceHandler } from '@cellularjs/net';
import { NotFound, SuccessData } from '$share/msg';
import { Transactional } from '@cellularjs/typeorm';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';
import { TokenRepository } from 'oauth/$inner/token.data';
import { UserSendResetPwdTokenReq } from './send-reset-pwd-token.qry';

@Transactional()
@Service({ scope: 'publish' })
export class UserSendResetPwdTokenCmd implements ServiceHandler {
  constructor(
    private sendUserResetPwdTokenReq: UserSendResetPwdTokenReq,
    private userRepo: UserRepository,
    private ssoTokenRepo: TokenRepository,
  ) { }

  async handle() {
    const { sendUserResetPwdTokenReq, userRepo, ssoTokenRepo } = this;

    const user = await userRepo.findOneBy({ email: sendUserResetPwdTokenReq.email });
    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    const expiredIn = Math.round((Date.now() / 1000) + (30 * 60));
    const tokenValue = crypto.genRandomStr();
    const hashedToken = await crypto.hash(tokenValue);

    const token = await ssoTokenRepo.save({
      userId: user.id,
      expIn: expiredIn,
      tokenValue: hashedToken,
    });

    return SuccessData({
      nonce: token.id,
      expIn: expiredIn,
      tokenValue,
    });
  }
}