import { Service, ServiceHandler } from '@cellularjs/net';
import { AppRepository } from 'oauth/$inner/app.data';
import { Auth, SignInData } from '$share/auth';
import { DeleteAppReq } from './delete-app.req';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class DeleteAppCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private appRepository: AppRepository,
    private deleteAppReq: DeleteAppReq,
  ) { }

  async handle() {
    const { appRepository, signInData, deleteAppReq } = this;

    const app = await appRepository.findOneBy({ id: deleteAppReq.appId });

    if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

    if (app.ownerId !== signInData.userId) throw Forbidden();

    await appRepository.delete({
      ownerId: signInData.userId,
      id: deleteAppReq.appId,
    });
  }
}
