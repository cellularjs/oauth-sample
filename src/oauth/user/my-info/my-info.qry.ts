import { Auth, SignInData } from '$share/auth';
import { NotFound, SuccessData } from '$share/msg';
import { Service, ServiceHandler } from '@cellularjs/net';
import { UserRepository } from 'oauth/$inner/user.data';

@Auth()
@Service({ scope: 'publish' })
export class UserMyInfoQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { signInData, userRepo } = this;
    const user = await userRepo.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    const { id, email, firstName, lastName, createdAt, avatar } = user;

    return SuccessData({ id, email, firstName, lastName, createdAt, avatar });
  }
}
