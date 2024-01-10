import { IsNotEmpty, MaxLength } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UserResetPwdReq {
  /**
   * Nonce === Token ID.
   */
  @IsNotEmpty({ message: () => t('val.required') })
  nonce: string;

  @IsNotEmpty({ message: () => t('val.required') })
  token: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  newPwd: string;
}
