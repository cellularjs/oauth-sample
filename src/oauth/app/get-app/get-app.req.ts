import { IsNotEmpty, IsUUID } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class GetAppReq {
  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  appId: string;
}