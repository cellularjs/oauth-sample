import { Service, ServiceHandler } from '@cellularjs/net';
import { AppRepository } from 'oauth/$inner/app.data';
import { Auth, SignInData } from '$share/auth';
import { CreateAppReq } from './create-app.req';
import { SuccessData, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { crypto } from 'oauth/$inner/crypto.helper';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class CreateAppCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private appRepository: AppRepository,
    private createAppReq: CreateAppReq,
  ) { }

  async handle() {
    const { appRepository, signInData, createAppReq } = this;

    const nApps = await appRepository.countBy({ ownerId: signInData.userId });
    const maxApp = 10;

    if (nApps >= maxApp) {
      throw Unprocessable({ msg: `Maximum ${maxApp} apps` });
    }

    const plainAppSecret = crypto.genRandomStr(16);
    const hashedAppSecret = await crypto.hash(plainAppSecret);
    const { id, name, createdAt, desc, logo, website, redirectURIs } = await appRepository.save({
      name: createAppReq.name,
      desc: createAppReq.desc,
      website: createAppReq.website,
      redirectURIs: createAppReq.redirectURIs,
      ownerId: signInData.userId,
      secret: hashedAppSecret,
    });

    return SuccessData({
      id,
      name,
      createdAt,
      desc,
      logo,
      website,
      redirectURIs,
      plainAppSecret,
    });
  }
}