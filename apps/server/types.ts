export const enum ContextsEnum {
  defi = "defi",
  finance = "finance",
}

export interface AuthUser {
  id: number;
  address: string;
  chainId: number;
  issuedAt: string;
}

export interface JWTPayload extends AuthUser {
  iat: number;
  exp: number;
}
