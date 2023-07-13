import { ValidateReq } from '$share/validator';
import { AuthGrantType } from '$share/types';
import { IsEnum, IsNotEmpty, IsUUID, MaxLength, ValidateIf } from 'class-validator';

@ValidateReq()
export class GrantAccessReq {
  @IsEnum(AuthGrantType)
  @IsNotEmpty({ message: () => t('val.required') })
  grantType: AuthGrantType;

  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => [AuthGrantType.AUTHORIZATION_CODE, AuthGrantType.REFRESH_TOKEN].includes(o.grantType))
  clientId?: string;

  @MaxLength(32, { message: () => t('val.string.max_length', { max: 32 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => [AuthGrantType.AUTHORIZATION_CODE, AuthGrantType.REFRESH_TOKEN].includes(o.grantType) && !o.codeVerifier)
  clientSecret?: string;

  //////////////////////////////// :Authorization code Grant: ////////////////////////////////
  @MaxLength(1000, { message: () => t('val.string.max_length', { max: 1000 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => o.grantType === AuthGrantType.AUTHORIZATION_CODE)
  code?: string;
  //////////////////////////////// -Authorization code Grant- ////////////////////////////////

  //////////////////////////////// :Refresh token Grant: ////////////////////////////////
  @MaxLength(1000, { message: () => t('val.string.max_length', { max: 1000 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => o.grantType === AuthGrantType.REFRESH_TOKEN)
  refreshToken?: string;
  //////////////////////////////// -Refresh token Grant- ////////////////////////////////

  //////////////////////////////// :Password Grant: ////////////////////////////////
  @MaxLength(254, { message: () => t('val.string.max_length', { max: 254 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => o.grantType === AuthGrantType.PASSWORD)
  usr?: string;

  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => o.grantType === AuthGrantType.PASSWORD)
  pwd?: string;
  //////////////////////////////// -Password Grant- ////////////////////////////////

  // :PKCE:
  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @ValidateIf(o => !!o.codeVerifier)
  codeVerifier?: string;
  // -PKCE-
}