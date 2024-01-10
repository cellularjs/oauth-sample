export type ConsentClaims = {
  userId: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  exp: number;

  codeChallenge?: string;
  codeChallengeMethod?: string;
}

export type CodeClaims = {
  clientId: string;
  redirectUri: string;
  userId: string;
  exp: number;
  scope?: string;

  codeChallenge?: string;
  codeChallengeMethod?: string;
}
