export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
}

export type AccessTokenClaims = {
  userId: string;
  clientId?: string;
  exp: number;
  scope?: string;
}

export type RefreshTokenClaims = Omit<AccessTokenClaims, 'exp'>;

export enum AuthResponseType {
  CODE = 'code',
}

export enum AuthGrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password',
}

export enum CodeChallengeMethod {
  S256 = 'S256',

  /**
   * For security reason, "plain" is not supported.
   * (In this sample application, "code_challenge" is saved as a claim inside JWT)
   */
  // PLAIN = 'plain',
}

export type PagingData = {
  total: number;
}

export type MetaData = {
  paging?: PagingData;
}

export interface SuccessResponse<Data> {
  data: Data;
  meta?: MetaData;
}

export interface ErrorItem {
  src: string;

  /**
   * Error code.
   */
  err: string;

  msg?: string;
}

export interface ErrorResponse {
  /**
   * Error code.
   */
  err: string;

  msg?: string;

  errors?: ErrorItem[];
}
