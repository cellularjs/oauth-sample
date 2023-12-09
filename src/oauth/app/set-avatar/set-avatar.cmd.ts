import * as sharp from 'sharp';
import * as path from 'path';
import { Service, ServiceHandler } from '@cellularjs/net';
import { Auth, SignInData } from '$share/auth';
import { Transactional } from '@cellularjs/typeorm';
import { UserSetAvatarReq } from './set-avatar.req';
import { Forbidden, NotFound, SuccessData } from '$share/msg';
import { AppRepository } from 'oauth/$inner/app.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class AppSetAvatarCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private setAvatarReq: UserSetAvatarReq,
    private appRepo: AppRepository,
  ) { }

  async handle() {
    const { signInData, setAvatarReq, appRepo } = this;

    const app = await appRepo.findOneBy({ id: setAvatarReq.appId });

    if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

    if (app.ownerId !== signInData.userId) throw Forbidden();

    const logoFileName = `app-logo-${app.id}.webp`;
    const logoFileUrl = `${logoFileName}?v=${new Date().getTime()}`;

    await sharp(setAvatarReq.logo.buffer)
      .resize(400, 400)
      .toFile(path.resolve(process.cwd(), 'tmp', logoFileName));

    app.logo = logoFileUrl;
    await appRepo.save(app);

    return SuccessData({ logo: logoFileUrl });
  }
}
