import * as sharp from 'sharp';
import * as path from 'path';
import { Service, ServiceHandler } from '@cellularjs/net';
import { Auth, SignInData } from '$share/auth';
import { Transactional } from '@cellularjs/typeorm';
import { UserSetAvatarReq } from './set-avatar.req';
import { UserRepository } from 'oauth/$inner/user.data';
import { NotFound, SuccessData } from '$share/msg';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class UserSetAvatarCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private setAvatarReq: UserSetAvatarReq,
    private userRepo: UserRepository,
  ) { }

  async handle() {
    const { signInData, setAvatarReq, userRepo } = this;
    const user = await userRepo.findOneBy({ id: signInData.userId });

    if (!user) throw NotFound({ msg: t('oauth.err.user_not_found') });

    const avatarFileName = `avatar-${signInData.userId}.webp`;
    const avatarFileUrl = `${avatarFileName}?v=${new Date().getTime()}`;

    await sharp(setAvatarReq.avatar.buffer)
      .resize(400, 400)
      .toFile(path.resolve(process.cwd(), 'tmp', avatarFileName));

    user.avatar = avatarFileUrl;
    await userRepo.save(user);

    return SuccessData({ avatar: avatarFileUrl });
  }
}
