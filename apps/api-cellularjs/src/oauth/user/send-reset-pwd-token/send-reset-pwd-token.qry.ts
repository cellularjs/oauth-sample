import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UserSendResetPwdTokenReq {
  @MaxLength(254, { message: () => t('val.string.max_length', { max: 254 }) })
  @IsEmail({}, { message: () => t('val.email.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  email: string;
}
