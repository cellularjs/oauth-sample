import { Service, ServiceHandler } from '@cellularjs/net';
import { AppRepository } from 'oauth/$inner/app.data';
import { Auth, SignInData } from '$share/auth';
import { SuccessData } from '$share/msg';

@Auth()
@Service({ scope: 'publish' })
export class MyAppsQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private appRepository: AppRepository,
  ) { }

  async handle() {
    const { appRepository, signInData } = this;

    const apps = await appRepository.find({
      select: ['id', 'createdAt', 'desc', 'logo', 'name', 'ownerId', 'redirectURIs', 'website'],
      where: { ownerId: signInData.userId },
    });

    return SuccessData(apps);
  }
}