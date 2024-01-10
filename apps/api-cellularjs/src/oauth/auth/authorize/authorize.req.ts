import { ValidateReq } from '$share/validator';
import { AuthResponseType, CodeChallengeMethod } from '$share/types';
import { IsNotEmpty, IsEnum, IsUUID, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

@ValidateReq()
export class AuthorizeReq {
  /**
   * code: authorization code flow
   * token: implicit flow
   */
  @IsEnum(AuthResponseType)
  @IsNotEmpty({ message: () => t('val.required') })
  reresponseType: AuthResponseType;

  @IsUUID('4', { message: () => t('val.id.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  clientId: string;

  @IsString({ message: () => t('val.string.invalid') })
  @IsNotEmpty({ message: () => t('val.required') })
  redirectUri: string;

  @IsString({ message: () => t('val.string.invalid') })
  @IsOptional()
  scope?: string;

  @IsString({ message: () => t('val.string.invalid') })
  @IsOptional()
  state?: string;

  // @IsString({ message: () => t('val.string.invalid') })
  // @IsOptional()
  // code_challenge?: string;

  // @IsString({ message: () => t('val.string.invalid') })
  // @IsOptional()
  // code_challenge_method?: string;

  // :PKCE:
  /**
   * @see https://security.stackexchange.com/a/186997
   */
  @MaxLength(256, { message: () => t('val.string.max_length', { max: 256 }) })
  @IsNotEmpty({ message: () => t('val.required') })
  @ValidateIf(o => !!o.codeChallengeMethod)
  codeChallenge?: string;

  @IsEnum(CodeChallengeMethod)
  @ValidateIf(o => !!o.codeChallengeMethod)
  codeChallengeMethod?: CodeChallengeMethod;
  // -PKCE-
}