import { ValidateReq } from '$share/validator';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ValidateReq()
export class ResetSecretReq {
  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  appId: string;
}
