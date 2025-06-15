import { tool, type ToolSet } from "ai";
import z from "zod";
import { TransferModule } from "../modules/transfer";
import { wrapInTag } from "./xml";

export class Tools {
  constructor(private options: {
    userAddress?: `0x${string}`;
    [key: string]: any;
  } = {}) {}

  getTools(): ToolSet {
    return {
      transfer: tool({
        description: "Generates send (transfer) transaction by user message. Don't check balance before transfer",
        parameters: z.object({
          recipient: z
            .string()
            .transform((val) => val as `0x${string}`)
            .describe(
              "The transfer receipient. Ethereum address (starts with 0x...) or ENS domain `name.eth`",
            ),
          amount: z
            .number()
            .describe("The ETH transfer amount. For example: `0.15`"),
        }),
        execute: async (args) => {
          const txData = await new TransferModule().generateTxForUser({ ...args, from: this.options.userAddress });
          const txDataJson = JSON.stringify(txData);
          const wrapped = wrapInTag(txDataJson, "tx");
          return wrapped
        },
      }),
      fetchBalance: tool({
        description: "Fetchs ETH balance of user current address",
        parameters: z.object({}),
        execute: async (args) => {
          if (!this.options.userAddress) throw new Error("Failed to get balance");
          const userBalance = await new TransferModule().getEtherBalance({ address: this.options.userAddress });
          return `Your current balance: ${userBalance} ETH`;
        }
      })
    }
  }
}
