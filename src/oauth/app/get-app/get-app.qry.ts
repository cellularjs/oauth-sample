import { Service, ServiceHandler } from '@cellularjs/net';
import { AppRepository } from 'oauth/$inner/app.data';
import { Auth, SignInData } from '$share/auth';
import { GetAppReq } from './get-app.req';
import { Forbidden, NotFound, SuccessData } from '$share/msg';

@Auth()
@Service({ scope: 'publish' })
export class GetAppQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private appRepository: AppRepository,
    private getAppReq: GetAppReq,
  ) { }

  async handle() {
    const { appRepository, signInData, getAppReq } = this;

    const app = await appRepository.findOne({
      select: ['id', 'createdAt', 'desc', 'logo', 'name', 'ownerId', 'redirectURIs', 'website'],
      where: { id: getAppReq.appId },
    });

    if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

    if (app.ownerId !== signInData.userId) throw Forbidden();

    return SuccessData(app);
  }
}