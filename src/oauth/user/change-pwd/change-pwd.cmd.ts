import { Auth, SignInData } from '$share/auth';
import { NotFound, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';
import { UserChangePwdReq } from './change-pwd.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UserChangePwdCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private changePwdReq: UserChangePwdReq,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { signInData, changePwdReq, userRepo } = this;

    const user = await userRepo.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    const isOldPwdMatched = await crypto.compare(changePwdReq.oldPwd, user.password);
    if (!isOldPwdMatched) {
      throw Unprocessable({ msg: t('oauth.err.pwd_incorrect') });
    }

    const hashedPwd = await crypto.hash(changePwdReq.newPwd);
    user.password = hashedPwd;
    await userRepo.save(user);
  }
}
