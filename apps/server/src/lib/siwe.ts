import { randomBytes } from "crypto";
import { SiweMessage } from "siwe";

export class SIWEService {
  private nonces = new Map<string, { nonce: string; expiresAt: number }>();
  private readonly NONCE_EXPIRY = 10 * 60 * 1000; // 10 minutes

  generateNonce(): string {
    const nonce = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + this.NONCE_EXPIRY;

    this.nonces.set(nonce, { nonce, expiresAt });
    this.cleanupExpiredNonces();

    return nonce;
  }

  validateNonce(nonce: string): boolean {
    const nonceData = this.nonces.get(nonce);
    if (!nonceData || Date.now() > nonceData.expiresAt) {
      this.nonces.delete(nonce);
      return false;
    }

    // Remove nonce after validation (one-time use)
    this.nonces.delete(nonce);
    return true;
  }

  private cleanupExpiredNonces(): void {
    const now = Date.now();
    for (const [nonce, data] of this.nonces.entries()) {
      if (now > data.expiresAt) {
        this.nonces.delete(nonce);
      }
    }
  }

  createMessage(params: {
    address: string;
    domain: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    statement?: string;
  }): SiweMessage {
    return new SiweMessage({
      domain: params.domain,
      address: params.address,
      statement: params.statement || "Sign in to authenticate your wallet",
      uri: params.uri,
      version: params.version,
      chainId: params.chainId,
      nonce: params.nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  }

  async verifyMessage(
    message: string,
    signature: string,
  ): Promise<{
    success: boolean;
    data?: SiweMessage;
    error?: string;
  }> {
    try {
      const siweMessage = new SiweMessage(message);

      // Validate nonce
      if (!this.validateNonce(siweMessage.nonce)) {
        return { success: false, error: "Invalid or expired nonce" };
      }

      // Verify signature
      const result = await siweMessage.verify({ signature });

      if (!result.success) {
        return { success: false, error: "Invalid signature" };
      }

      // Check expiration
      if (
        siweMessage.expirationTime &&
        new Date() > new Date(siweMessage.expirationTime)
      ) {
        return { success: false, error: "Message expired" };
      }

      return { success: true, data: siweMessage };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }
}
