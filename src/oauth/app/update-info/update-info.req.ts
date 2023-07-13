import { IsArray, IsNotEmpty, IsString, MaxLength, IsOptional, ArrayMaxSize, ArrayMinSize, IsUUID } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq()
export class UpdateInfoReq {
  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  appId: string;

  @MaxLength(100, { message: () => t('val.string.max_length', { max: 100 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  name: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  desc: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsOptional()
  website?: string;

  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @MaxLength(256, { each: true, message: () => t('val.string.max_length', { max: 256 }) })
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty({ message: () => t('val.required') })
  redirectURIs: string[];
}