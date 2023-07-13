import { NotFound, SuccessData } from '$share/msg';
import { Service, ServiceHandler } from '@cellularjs/net';
import { UserRepository } from 'oauth/$inner/user.data';
import { UserGetUserReq } from './get-user.req';

@Service({ scope: 'publish' })
export class UserGetUserQry implements ServiceHandler {
  constructor(
    private userRepo: UserRepository,
    private getUserUserReq: UserGetUserReq,
  ) { }

  async handle() {
    const { userRepo, getUserUserReq } = this;
    const user = await userRepo.findOneBy({ id: getUserUserReq.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    const { id, firstName, lastName, createdAt, avatar } = user;

    return SuccessData({ id, firstName, lastName, createdAt, avatar });
  }
}
