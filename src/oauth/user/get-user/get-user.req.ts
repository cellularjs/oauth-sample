import { IsNotEmpty } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UserGetUserReq {
  @IsNotEmpty({ message: () => t('val.required') })
  userId: string;
}
