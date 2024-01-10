import { SignInData } from '$share/auth';
import { jwt } from 'oauth/$inner/jwt';
import { Service, ServiceHandler } from '@cellularjs/net';
import { AuthorizeReq } from './authorize.req';
import { AppRepository } from 'oauth/$inner/app.data';
import { NotFound, SuccessData, Unprocessable } from '$share/msg';
import { ConsentClaims } from '../typing';

@Service({ scope: 'publish' })
export class AuthAuthorizeQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private authorizeReq: AuthorizeReq,
    private appRepo: AppRepository,
  ) { }

  async handle() {
    const { signInData, authorizeReq, appRepo } = this;
    const { redirectUri, clientId, scope, state, codeChallenge, codeChallengeMethod } = authorizeReq;

    if (!signInData) {
      return SuccessData({ redirectTo: 'SignIn page', authorizeReq });
    }

    const app = await appRepo.findOneBy({ id: clientId });

    if (!app) {
      throw NotFound({ msg: t('oauth.err.app_not_found') });
    }

    if (!app.redirectURIs.includes(redirectUri)) {
      throw Unprocessable({ msg: t('oauth.err.app_redirect_uri_not_match') });
    }

    const nowInSecond = (new Date().getTime() / 1000);
    const timeoutInSecond = 60 * 15; // user have 15 minutes to approve or deny
    const consent = jwt.sign<ConsentClaims>({
      clientId,
      userId: signInData.userId,
      redirectUri,
      scope,
      state,
      exp: nowInSecond + timeoutInSecond,
      codeChallenge,
      codeChallengeMethod,
    });

    return SuccessData({
      redirectTo: 'Consent screen(Are you allow this application to ... ?)',
      app: {
        logo: app.logo,
        name: app.name,
        website: app.website,
        createdAt: app.createdAt,
      },
      consent,
    });
  }
}
