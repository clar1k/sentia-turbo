import type { AuthUser, JWTPayload } from "types";
import jwt from 'jsonwebtoken';

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