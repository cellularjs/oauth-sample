import { Auth, SignInData } from '$share/auth';
import { Service, ServiceHandler } from '@cellularjs/net';
import { ApproveReq } from './approve.req';
import { Forbidden, SuccessData, Unprocessable } from '$share/msg';
import { ConsentClaims, CodeClaims } from '../typing';
import { jwt } from 'oauth/$inner/jwt';

@Auth()
@Service({ scope: 'publish' })
export class AuthApproveQry implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private approveReq: ApproveReq,
  ) { }

  async handle() {
    const { signInData } = this;
    const consentClaims = this._getConsentClaims();

    if (signInData.userId !== consentClaims.userId) {
      throw Forbidden();
    }

    const nowInSecond = (new Date().getTime() / 1000);
    const timeoutInSecond = 60;
    const code = jwt.sign<CodeClaims>({
      clientId: consentClaims.clientId,
      redirectUri: consentClaims.redirectUri,
      userId: signInData.userId,
      exp: nowInSecond + timeoutInSecond,
      scope: consentClaims.scope,
      codeChallenge: consentClaims.codeChallenge,
      codeChallengeMethod: consentClaims.codeChallengeMethod,
    });

    return SuccessData({
      redirectUri: consentClaims.redirectUri,
      state: consentClaims.state,
      code,
    });
  }

  private _getConsentClaims() {
    const { approveReq } = this;

    try {
      return jwt.verify<ConsentClaims>(approveReq.consent);
    } catch {
      throw Unprocessable({ msg: 'Invalid consent nonce, it may be expired' });
    }
  }
}
