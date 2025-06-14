import type { AuthUser, JWTPayload } from "types";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { env } from "@/env";

const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${env.DYNAMIC_API_KEY}/.well-known/jwks`;

const client = new JwksClient({
  jwksUri: jwksUrl,
  rateLimit: true,
  cache: true,
  cacheMaxEntries: 5,  // Maximum number of cached keys
  cacheMaxAge: 600000 // Cache duration in milliseconds (10 minutes in this case))}
});


export const verifyDynamicJWT = async (token: string): Promise<JwtPayload | null> => {
  try {
    const signingKey = await client.getSigningKey();
    const publicKey = signingKey.getPublicKey();

    console.log("Public", publicKey);
    console.log(token)
    const decodedToken: JwtPayload = jwt.verify(token, publicKey, {
      ignoreExpiration: false,
    }) as JwtPayload;
    
    if (decodedToken?.scopes?.includes('requiresAdditionalAuth')) {
      throw new Error('Additional verification required');
    }

    return decodedToken;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export class JWTService {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN ? 
      parseInt(process.env.JWT_EXPIRES_IN) : 
      7 * 24 * 60 * 60; // 7 days in seconds
  }

  generateToken(user: AuthUser): string {
    return jwt.sign(user, this.secret, { expiresIn: this.expiresIn, algorithm: "HS256" });
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch {
      return null;
    }
  }
}