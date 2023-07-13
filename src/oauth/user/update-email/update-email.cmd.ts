import { Auth, SignInData } from '$share/auth';
import { NotFound, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';
import { UserUpdateEmailReq } from './update-email.req';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UserUpdateEmailCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private updateEmailReq: UserUpdateEmailReq,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { updateEmailReq, signInData, userRepo } = this;
    const user = await userRepo.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    if (user.email === updateEmailReq.email) {
      return;
    }

    const isOldPwdMatched = await crypto.compare(updateEmailReq.password, user.password);
    if (!isOldPwdMatched) {
      throw Unprocessable({ msg: t('oauth.err.pwd_incorrect') });
    }

    const isEmailInUse = await userRepo.exist({
      where: { email: updateEmailReq.email },
    });

    if (isEmailInUse) {
      throw Unprocessable({ msg: t('oauth.err.email_in_use') });
    }

    await userRepo.update(
      { id: signInData.userId },
      { email: updateEmailReq.email },
    );
  }
}
