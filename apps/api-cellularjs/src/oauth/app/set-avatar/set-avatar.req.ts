import { ValidateReq, FileMime, MaxFileSize } from '$share/validator';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ValidateReq()
export class UserSetAvatarReq {
  @MaxFileSize(1)
  @FileMime({ mime: ['image/jpg', 'image/png', 'image/jpeg'] })
  @IsNotEmpty({ message: () => t('val.required') })
  logo: Express.Multer.File;

  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  appId: string;
}
