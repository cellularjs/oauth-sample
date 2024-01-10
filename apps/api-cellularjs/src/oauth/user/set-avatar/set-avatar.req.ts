import { ValidateReq, FileMime, MaxFileSize } from '$share/validator';
import { IsNotEmpty } from 'class-validator';

@ValidateReq()
export class UserSetAvatarReq {
  @MaxFileSize(1)
  @FileMime({ mime: ['image/jpg', 'image/png', 'image/jpeg'] })
  @IsNotEmpty({ message: () => t('val.required') })
  avatar: Express.Multer.File;
}
