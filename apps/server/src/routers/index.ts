import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText, safeStreamText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { walletRouter } from "./wallet.route";
import { authRouter } from "./auth.router";
import { financeRoute } from "./finance.route";
import { newsRouter } from "./news.route";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  prompt: protectedProcedure
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
    promptStream: protectedProcedure
    .input(type({ message: "string" }))
    .subscription(async function* (opts) {
      const { input, signal } = opts;

      const streamResult = safeStreamText({
        messages: [{ role: "user", content: input.message }],
        abortSignal: signal,
      });

      if (streamResult.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to initialize AI stream.",
          cause: streamResult.error,
        });
      }

      try {
        for await (const delta of streamResult.value.textStream) {
          yield delta;
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Stream aborted by client.");
          return;
        }
        
        console.error("An error occurred during streaming:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during streaming.",
          cause: error,
        });
      }
    }),
  wallets: walletRouter,
  auth: authRouter,
  finance: financeRoute,
  news: newsRouter,
});

export type AppRouter = typeof appRouter;
