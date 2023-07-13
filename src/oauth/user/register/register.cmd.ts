import { SuccessData, Unprocessable } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { Service, ServiceHandler } from '@cellularjs/net';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';
import { UserRegisterReq } from './register.req';

@Transactional()
@Service({ scope: 'publish' })
export class UserRegisterCmd implements ServiceHandler {
  constructor(
    private registerReq: UserRegisterReq,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { registerReq, userRepo } = this;

    const isUserWithEmailExist = !!await userRepo.findOneBy({ email: registerReq.email });
    if (isUserWithEmailExist) {
      throw Unprocessable({ msg: t('oauth.err.email_in_use') });
    }

    const hashedPwd = await crypto.hash(registerReq.password);

    const { email, firstName, lastName, id, createdAt, avatar } = await userRepo.save({
      email: registerReq.email,
      firstName: registerReq.firstName,
      lastName: registerReq.lastName,
      password: hashedPwd,
    });

    return SuccessData({ id, email, firstName, lastName, createdAt, avatar });
  }
}
