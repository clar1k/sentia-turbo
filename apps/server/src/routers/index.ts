import { publicProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { Tools } from "@/lib/mcp/tools";

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
        tools: new Tools().getTools(),
      });

      if (text.isErr()) {
        return errorResponse(text.error, ErrorCode.PROMPT_ERROR);
      }

      return { text, ok: true };
    }),
});

export type AppRouter = typeof appRouter;
