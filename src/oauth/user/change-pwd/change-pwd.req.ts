import { ValidateReq } from '$share/validator';
import { IsNotEmpty, MaxLength } from 'class-validator';

@ValidateReq()
export class UserChangePwdReq {
  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  newPwd: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  oldPwd: string;
}
