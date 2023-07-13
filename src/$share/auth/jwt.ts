import { IRQ } from '@cellularjs/net';
import { SignInData } from './sign-in-data';
import { jwt } from 'oauth/$inner/jwt';
import { AuthTokens, AccessTokenClaims, RefreshTokenClaims } from '$share/types';

export function parseToken(irq: IRQ): SignInData {
  const token = irq.header.authorization?.split(' ')[1];
  const tokenClaims = jwt.verify<AccessTokenClaims>(token);

  return { userId: tokenClaims.userId };
}

export function genAccessToken(claims: Omit<AccessTokenClaims, 'exp'>) {
  const exp = (new Date().getTime() / 1000) + (60 * 5); // 5 minutes

  return jwt.sign<AccessTokenClaims>({ ...claims, exp });
}

export function genAuthTokens(claims: Omit<AccessTokenClaims, 'exp'>): AuthTokens {
  return {
    accessToken: genAccessToken(claims),
    refreshToken: jwt.sign<RefreshTokenClaims>({
      userId: claims.userId,
      scope: claims.scope,
      clientId: claims.clientId,
    }),
  };
}
