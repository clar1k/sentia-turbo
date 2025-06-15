import {
  AuthRequest,
  createAuthRequestMessage,
  createAuthVerifyMessage,
  parseRPCResponse,
  RPCMethod,
  createEIP712AuthMessageSigner,
} from "@erc7824/nitrolite";
import {
  createWalletClient,
  http,
  type Address,
  type WalletClient,
} from "viem";
import { polygon } from "viem/chains";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { Wallet } from "ethers";
import { getDefaultSigner } from "./utls/signer";

const APP_NAME = "Sentia";
const CLEAR_NODE_URL = "wss://clearnet.yellow.com/ws";

export async function runBackAuthFlow(): Promise<string> {
  /* ─ keys & accounts ─ */
  const defSigner = getDefaultSigner();
  const backEndPk = Bun.env.PRIVATE_KEY as `0x${string}` | undefined;
  if (!backEndPk) throw new Error("Missing back-end private keys");

  const backEndAccount: PrivateKeyAccount = privateKeyToAccount(backEndPk);
  const backEndClient: WalletClient = createWalletClient({
    account: backEndAccount,
    chain: polygon,
    transport: http("https://polygon-rpc.com"),
  });

  /* ─ build initial auth request ─ */
  const authReq: AuthRequest = {
    wallet: backEndAccount.address,
    participant: (await defSigner.getAddress()) as Address,
    app_name: APP_NAME,
    expire: (Math.floor(Date.now() / 1000) + 3600).toString(),
    scope: "Any string",
    application: "0x0000000000000000000000000000000000000000",
    allowances: [],
  };
  const authReqMsg = await createAuthRequestMessage(authReq);

  /* ─ create a promise that resolves with the JWT ─ */
  return new Promise<string>((resolve, reject) => {
    const ws = new WebSocket(CLEAR_NODE_URL);

    ws.onopen = () => ws.send(authReqMsg);

    ws.onerror = (e) => reject(e);

    ws.onmessage = async (ev) => {
      const msg = parseRPCResponse(ev.data.toString());

      switch (msg.method) {
        case RPCMethod.AuthChallenge:
          const signer = createEIP712AuthMessageSigner(
            backEndClient,
            {
              scope: authReq.scope!,
              application: authReq.application!,
              participant: authReq.participant!,
              expire: authReq.expire!,
              allowances: [],
            },
            { name: APP_NAME },
          );
          ws.send(await createAuthVerifyMessage(signer, msg));
          break;

        case RPCMethod.AuthVerify:
          if (!msg.params.success) {
            reject(new Error("Auth failed"));
          } else {
            resolve(msg.params.jwtToken);
          }
          ws.close();
          break;

        case RPCMethod.Error:
          reject(new Error("RPC error from ClearNode"));
      }
    };
  });
}
