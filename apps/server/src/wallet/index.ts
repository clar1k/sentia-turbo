import { db } from "@/db";
import { usersWallet } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ethers, id } from "ethers";

interface ActionWalletOptions {
  userId: number,
};

export interface WaleltResponseType {
  privateKey: string;
  address: string;
}

const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
  }
}

export const createUserWallet = async (options: ActionWalletOptions) => {
  const wallet = generateWallet();
  await db.insert(usersWallet).values({ ...wallet, userId: options.userId });
  return wallet;
}

export const getUserWallet = async (options: ActionWalletOptions): Promise<WaleltResponseType> => {
  const wallet = await db.select({ 
    privateKey: usersWallet.privateKey,
    address: usersWallet.address,
  }).from(usersWallet)
    .where(eq(usersWallet.userId, options.userId)).then(resp => resp[0]);
  return wallet;
}