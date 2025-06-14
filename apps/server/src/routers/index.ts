import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { walletRouter } from "./wallet.route";
import { authRouter } from "./auth.router";
import { financeRoute } from "./finance.route";
import { newsRouter } from "./news.route";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  prompt: publicProcedure
    .input(type({ message: "string" }))
    .mutation(async (c) => {
      const text = await safeGenerateText({
        messages: [
          {
            role: "user",
            content: c.input.message,
          },
        ],
      });

      if (text.isErr()) {
        return errorResponse(text.error, ErrorCode.PROMPT_ERROR);
      }

      return { ok: true, text };
    }),
  wallets: walletRouter,
  auth: authRouter,
  finance: financeRoute,
  news: newsRouter,
});

export type AppRouter = typeof appRouter;
