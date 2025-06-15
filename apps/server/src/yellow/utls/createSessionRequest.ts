import { ethers, Wallet } from "ethers";
import {
  createAppSessionMessage,
  type MessageSigner,
  type CreateAppSessionRequest,
  type ResponsePayload,
  type RequestData,
} from "@erc7824/nitrolite";
import { Address, type Hex } from "viem";
import { getDefaultSigner } from "./signer";

const PRICE = "10";
/**
 * Builds & signs a Nitrolite “CreateAppSession” message that
 * transfers 1 USDC from the caller to a recipient.
 *
 * Env vars:
 *   PRIVATE_KEY — sender’s EOA private key (0x…)
 *   RECIPIENT   — address that will receive the USDC
 */
export async function getTransferSessionTx(
  senderAddress: `0x${string}`,
  recipientAddress: `0x${string}`,
  payload: RequestData | ResponsePayload,
): Promise<string> {
  /* ─ chain context ─ */
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-rpc.com",
  );
  const signerWallet = getDefaultSigner();
  const USDC: Address = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

  /* ─ encode calldata (optional showcase) ─ */
  const iface = new ethers.Interface(["function transfer(address,uint256)"]);
  const calldata = iface.encodeFunctionData("transfer", [RECIPIENT, AMOUNT]);

  /* ─ nitrolite signer helper ─ */
  const messageSigner = async (
    payload: RequestData | ResponsePayload,
  ): Promise<Hex> => {
    try {
      const wallet = new ethers.Wallet("0xYourPrivateKey");

      const messageBytes = ethers.utils.arrayify(
        ethers.utils.id(JSON.stringify(payload)),
      );

      const flatSignature = await wallet._signingKey().signDigest(messageBytes);

      const signature = ethers.utils.joinSignature(flatSignature);

      return signature as Hex;
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  };

  /* ─ craft session params ─ */
  const params: CreateAppSessionRequest[] = [
    {
      definition: {
        protocol: "nitroliterpc",
        participants: [senderAddress, recipientAddress],
        weights: [50, 50],
        quorum: 100,
        challenge: 0,
        allocate_amount: 1,
        nonce: Date.now(),
      },
      allocations: [
        {
          participant: senderAddress,
          asset: "usdc",
          amount: PRICE,
        },
        {
          participant: recipientAddress,
          asset: "usdc",
          amount: "0",
        },
      ],
    },
  ];

  /* ─ sign & return ─ */
  return createAppSessionMessage(messageSigner, params);
}
