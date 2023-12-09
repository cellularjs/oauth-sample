import { Service, ServiceHandler } from '@cellularjs/net';
import { Auth, SignInData } from '$share/auth';
import { Transactional } from '@cellularjs/typeorm';
import { Forbidden, NotFound, SuccessData } from '$share/msg';
import { AppRepository } from 'oauth/$inner/app.data';
import { ResetSecretReq } from './reset-secret.req';
import { crypto } from 'oauth/$inner/crypto.helper';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class AppResetSecretCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private resetSecretReq: ResetSecretReq,
    private appRepo: AppRepository,
  ) { }

  async handle() {
    const { signInData, resetSecretReq, appRepo } = this;

    const app = await appRepo.findOneBy({ id: resetSecretReq.appId });

    if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

    if (app.ownerId !== signInData.userId) throw Forbidden();

    const plainAppSecret = crypto.genRandomStr(16);
    const hashedAppSecret = await crypto.hash(plainAppSecret);

    await appRepo.save({
      ...app,
      secret: hashedAppSecret,
    });

    return SuccessData({ plainAppSecret });
  }
}
