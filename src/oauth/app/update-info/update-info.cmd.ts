import { Service, ServiceHandler } from '@cellularjs/net';
import { AppRepository } from 'oauth/$inner/app.data';
import { Auth, SignInData } from '$share/auth';
import { UpdateInfoReq } from './update-info.req';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '@cellularjs/typeorm';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class AppUpdateInfoCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private appRepository: AppRepository,
    private updateInfoReq: UpdateInfoReq,
  ) { }

  async handle() {
    const { appRepository, signInData, updateInfoReq } = this;
    const app = await appRepository.findOneBy({ id: updateInfoReq.appId });
    if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

    if (app.ownerId !== signInData.userId) throw Forbidden();

    await appRepository.update(
      { id: updateInfoReq.appId },
      {
        name: updateInfoReq.name,
        desc: updateInfoReq.desc,
        website: updateInfoReq.website,
        redirectURIs: updateInfoReq.redirectURIs,
      },
    );
  }
}