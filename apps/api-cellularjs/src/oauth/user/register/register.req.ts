import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UserRegisterReq {
  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  firstName: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  lastName: string;

  /**
   * @see https://stackoverflow.com/a/574698/17059212
   */
  @MaxLength(254, { message: () => t('val.string.max_length', { max: 254 }) })
  @IsEmail({}, { message: () => t('val.email.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  email: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  password: string;
}