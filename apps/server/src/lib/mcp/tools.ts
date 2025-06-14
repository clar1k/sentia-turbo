import { tool, type ToolSet } from "ai";
import z from "zod";
import { TransferModule } from "../modules/transfer";
import { wrapInTag } from "./xml";

export class Tools {
  constructor(private userAddress?: string) {}

  getTools(): ToolSet {
    return {
      swap: tool({
        description: "Generates send (transfer) transaction by user message",
        parameters: z.object({
          recipient: z
            .string()
            .describe(
              "The transfer receipient. Ethereum address (starts with 0x...) or ENS domain `name.eth`",
            ),
          amount: z
            .number()
            .describe("The ETH transfer amount. For example: `0.15`"),
        }),
        execute: async (args) => {
          const txData = new TransferModule().generateTxForUser({ ...args, from: this.userAddress });
          const txDataJson = JSON.stringify(txData, null, 2);
          return wrapInTag(txDataJson, "tx");
        },
      }),
    }
  }
}
