import { ValidateReq } from '$share/validator';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@ValidateReq()
export class ApproveReq {
  @MaxLength(1000, { message: () => t('val.string.max_length', { max: 1000 }) })
  @IsString({ message: () => t('val.string.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  consent: string;
}