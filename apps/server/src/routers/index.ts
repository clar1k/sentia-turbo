import {
  protectedProcedure,
  publicProcedure,
  router,
} from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText, safeStreamText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { Tools } from "@/lib/mcp/tools";
import { TRPCError } from "@trpc/server";
import { newsRouter } from "./news.route";
import { financeRouter } from "@/routers/finance.route";
import { walletRouter } from "./wallet.route";
import { authRouter } from "./auth.route";
import { defiRouter } from "./defi.route";
import z from "zod";
import { systemPrompt } from "@/lib/prompts/system";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  prompt: protectedProcedure
    .input(z.object({
      message: z.string(),
      messages: z.array(z.record(z.string())).optional(),
      options: z.record(z.string()).optional(),
    }))
    .mutation(async (c) => {
      const toolOptions = {
        userAddress: c.input.options?.from as `0x${string}`,
        ...c.input.options
      }; 
      const text = await safeGenerateText({
        messages: [
          {
            role: "user",
            content: c.input.message,
          },
        ],
        system: systemPrompt(),
        tools: new Tools(toolOptions).getTools(),
      });

      if (text.isErr()) {
        console.log(text);
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
        tools: new Tools().getTools(),
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
  finance: financeRouter,
  news: newsRouter,
  defi: defiRouter,
});

export type AppRouter = typeof appRouter;
