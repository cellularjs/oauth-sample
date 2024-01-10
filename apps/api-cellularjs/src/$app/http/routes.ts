import { Express, Router } from 'express';
import { multerSingleProxyTo, proxyTo } from '$share/express-proxy';

export function configRoutes(app: Express) {
  // /api/oauth
  const oauthRouter = Router();

  // user
  oauthRouter.post('/user/register', proxyTo('OAuth:UserRegisterCmd'));
  oauthRouter.put('/user/change-pwd', proxyTo('OAuth:UserChangePwdCmd'));
  oauthRouter.post('/user/send-reset-pwd-token', proxyTo('OAuth:UserSendResetPwdTokenCmd'));
  oauthRouter.post('/user/reset-pwd', proxyTo('OAuth:UserResetPwdCmd'));
  oauthRouter.get('/user/my-info', proxyTo('OAuth:UserMyInfoQry'));
  oauthRouter.get('/user/:userId', proxyTo('OAuth:UserGetUserQry'));
  oauthRouter.put('/user/update-name', proxyTo('OAuth:UserUpdateNameCmd'));
  oauthRouter.put('/user/update-email', proxyTo('OAuth:UserUpdateEmailCmd'));
  oauthRouter.post('/user/set-avatar', multerSingleProxyTo('avatar', 'OAuth:UserSetAvatarCmd'));

  // app
  oauthRouter.post('/app', proxyTo('OAuth:CreateAppCmd'));
  oauthRouter.get('/app', proxyTo('OAuth:MyAppsQry'));
  oauthRouter.delete('/app/:appId', proxyTo('OAuth:DeleteAppCmd'));
  oauthRouter.get('/app/:appId', proxyTo('OAuth:GetAppQry'));
  oauthRouter.put('/app/:appId', proxyTo('OAuth:AppUpdateInfoCmd'));
  oauthRouter.post('/app/:appId/set-avatar', multerSingleProxyTo('logo', 'OAuth:AppSetAvatarCmd'));
  oauthRouter.post('/app/:appId/reset-secret', proxyTo('OAuth:AppResetSecretCmd'));

  // auth
  oauthRouter.get('/auth/authorize', proxyTo('OAuth:AuthAuthorizeQry'));
  oauthRouter.post('/auth/approve', proxyTo('OAuth:AuthApproveQry'));
  oauthRouter.post('/auth/grant-access', proxyTo('OAuth:AuthGrantAccessQry'));

  app.use('/api/oauth', oauthRouter);
}
