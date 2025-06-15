// src/utils/wallet.ts
import { Wallet } from "ethers"; // v5.7.2

let walletVal: Wallet;
/**
 * Creates a completely new, random Ethereum wallet.
 *
 * @returns {Wallet} — The generated wallet object (contains address, privateKey, mnemonic, etc.).
 */
export function getDefaultSigner(): Wallet {
  if (!walletVal) {
    walletVal = Wallet.createRandom();
    return walletVal;
  }
  return walletVal;
}
