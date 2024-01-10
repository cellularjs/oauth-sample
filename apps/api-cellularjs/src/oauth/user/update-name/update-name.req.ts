import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UserUpdateNameReq {
  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsString({ message: () => t('val.string.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  firstName: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsString({ message: () => t('val.string.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  lastName: string;
}
