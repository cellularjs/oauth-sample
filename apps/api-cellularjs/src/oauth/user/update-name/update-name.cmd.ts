import { Auth, SignInData } from '$share/auth';
import { NotFound } from '$share/msg';
import { Transactional } from '@cellularjs/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { UserRepository } from 'oauth/$inner/user.data';
import { UserUpdateNameReq } from './update-name.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UserUpdateNameCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private updateNameReq: UserUpdateNameReq,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { updateNameReq, signInData, userRepo } = this;
    const user = await userRepo.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    await userRepo.update(
      { id: signInData.userId },
      { firstName: updateNameReq.firstName, lastName: updateNameReq.lastName },
    );
  }
}
