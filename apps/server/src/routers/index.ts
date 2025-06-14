import { jwtService, mergeRouters, protectedProcedure, publicProcedure, router, siweService } from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { Tools } from "@/lib/mcp/tools";
import { createUserWallet, getUserWallet } from "@/wallet";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { UserService } from "@/lib/user";

const userService = new UserService();

const walletRouter = router({
  create: protectedProcedure
    .input(type({}))
    .mutation(async ({ ctx }) => {
      const userWallet = await getUserWallet({ userId: ctx.user.id }); // FIXME: Temprorary thing
      if (!userWallet) {
        console.log("test", userWallet);
      }
      return { wallet: userWallet || await createUserWallet({ userId: 1000 }), ok: true };
    }),
});

const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});


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
  wallets: walletRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
