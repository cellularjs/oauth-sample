import * as nodeJsCrypto from 'crypto';
import { jwt } from 'oauth/$inner/jwt';
import { Service, ServiceHandler } from '@cellularjs/net';
import { AppEntity, AppRepository } from 'oauth/$inner/app.data';
import { Forbidden, InternalError, NotFound, SuccessData, UnAuthorized, Unprocessable } from '$share/msg';
import { genAccessToken, genAuthTokens } from '$share/auth/jwt';
import { AuthGrantType, AuthTokens, RefreshTokenClaims, CodeChallengeMethod } from '$share/types';
import { CodeClaims } from '../typing';
import { GrantAccessReq } from './grant-access.req';
import { crypto } from 'oauth/$inner/crypto.helper';
import { UserRepository } from 'oauth/$inner/user.data';

@Service({ scope: 'publish' })
export class AuthGrantAccessQry implements ServiceHandler {
  constructor(
    protected grantAccessReq: GrantAccessReq,
    protected appRepo: AppRepository,
    protected userRepo: UserRepository,
  ) { }

  async handle() {
    const { grantAccessReq } = this;
    const grantMethod = supportedGrants[grantAccessReq.grantType];

    return grantMethod.call(this);
  }
}

/////////////////////////////////// Grants: ///////////////////////////////////

const supportedGrants = {
  [AuthGrantType.PASSWORD]: passwordGrant,
  [AuthGrantType.REFRESH_TOKEN]: refreshTokenGrant,
  [AuthGrantType.AUTHORIZATION_CODE]: authorizationCodeGrant,
};

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.3
 */
async function passwordGrant(this: AuthGrantAccessQry) {
  const { grantAccessReq, userRepo } = this;
  const user = await userRepo.findOneBy({ email: grantAccessReq.usr });

  if (!user) {
    throw UnAuthorized({ msg: t('oauth.err.login_credential_incorrect') });
  }

  const isPwdMatched = await crypto.compare(grantAccessReq.pwd, user.password);
  if (!isPwdMatched) {
    throw UnAuthorized({ msg: t('oauth.err.login_credential_incorrect') });
  }

  return SuccessData<AuthTokens>(genAuthTokens({ userId: user.id }));
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-1.5
 */
async function refreshTokenGrant(this: AuthGrantAccessQry) {
  const { grantAccessReq } = this;
  const refreshTokenClaims = jwt.verify<RefreshTokenClaims>(grantAccessReq.refreshToken);
  const isThirdPartyApp = !!refreshTokenClaims.clientId;

  if (!isThirdPartyApp) {
    return SuccessData({
      accessToken: genAccessToken({ userId: refreshTokenClaims.userId }),
    });
  }

  const app = await verifyApp.call(this, refreshTokenClaims.clientId);

  if (grantAccessReq.clientSecret) {
    const isClientSecretMatched = await crypto.compare(grantAccessReq.clientSecret, app.secret);
    if (!isClientSecretMatched) throw Forbidden({ msg: t('oauth.err.app_secret_not_match') });
  }

  return SuccessData({
    accessToken: genAccessToken({
      userId: refreshTokenClaims.userId,
      clientId: refreshTokenClaims.clientId,
      scope: refreshTokenClaims.scope,
    }),
  });
}

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1
 */
async function authorizationCodeGrant(this: AuthGrantAccessQry) {
  const { grantAccessReq } = this;
  const codeClaims = getCodeClaims(grantAccessReq);

  const app = await verifyApp.call(this, codeClaims.clientId);

  if (grantAccessReq.clientSecret) {
    const isClientSecretMatched = await crypto.compare(grantAccessReq.clientSecret, app.secret);
    if (!isClientSecretMatched) {
      throw Forbidden({ msg: t('oauth.err.app_secret_not_match') });
    }
  }

  if (grantAccessReq.codeVerifier) {
    verifyPKCE(grantAccessReq.codeVerifier, codeClaims);
  }

  return SuccessData<AuthTokens>(genAuthTokens({
    userId: codeClaims.userId,
    clientId: codeClaims.clientId,
    scope: codeClaims.scope,
  }));
}

/////////////////////////////////// Helpers: ///////////////////////////////////

/**
 * @see https://security.stackexchange.com/a/186997
 * @see https://datatracker.ietf.org/doc/html/rfc7636#page-9
 */
function verifyPKCE(codeVerifier: string, codeClaims: CodeClaims) {
  if (!codeClaims.codeChallenge || !codeClaims.codeChallengeMethod) {
    throw Unprocessable({ msg: 'This authorization code don\'t support PKCE' });
  }

  // For security reason, CodeChallengeMethod.PLAIN is not supported.
  //
  // if (codeClaims.codeChallengeMethod === CodeChallengeMethod.PLAIN) {
  //   if (codeClaims.codeChallenge === codeVerifier) return;

  //   throw Forbidden({ msg: 'Code verifier is not matched' });
  // }

  if (codeClaims.codeChallengeMethod === CodeChallengeMethod.S256) {
    const digestedCodeVerifier = Buffer.from(nodeJsCrypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('hex')).toString('base64url');

    if (digestedCodeVerifier === codeClaims.codeChallenge) return;

    throw Forbidden({ msg: t('oauth.err.pkce_code_verifier_not_match') });
  }

  // If the logic is correct, there is no error will be throw, this is a fallback for stupid thing happen.
  throw InternalError({ msg: 'codeChallengeMethod is not supported' });
}

function getCodeClaims(grantAccessReq: GrantAccessReq) {
  try {
    return jwt.verify<CodeClaims>(grantAccessReq.code);
  } catch (err) {
    throw Unprocessable({ msg: 'Invalid authorization code, it may be expired' });
  }
}

async function verifyApp(this: AuthGrantAccessQry, clientId: string): Promise<AppEntity> {
  const { grantAccessReq, appRepo } = this;

  const app = await appRepo.findOneBy({ id: grantAccessReq.clientId });

  if (!app) throw NotFound({ msg: t('oauth.err.app_not_found') });

  if (app.id !== clientId) throw Forbidden();

  return app;
}
