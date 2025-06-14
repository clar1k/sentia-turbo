import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { walletRouter } from "./wallet.route";
import { authRouter } from "./auth.router";
import { financeRoute } from "./finance.route";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  prompt: publicProcedure
    .input(type({ message: "string" }))
    .mutation(async (ctx) => {
      const text = await safeGenerateText({
        messages: [
          {
            role: "user",
            content: ctx.input.message,
          },
        ],
      });

      if (text.isErr()) {
        return errorResponse(text.error, ErrorCode.PROMPT_ERROR);
      }

      return { text, ok: true };
    }),
  wallets: walletRouter,
  auth: authRouter,
  finance: financeRoute,
});

export type AppRouter = typeof appRouter;
