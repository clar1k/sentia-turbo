import {
  jwtService,
  mergeRouters,
  protectedProcedure,
  publicProcedure,
  router,
  siweService,
} from "@/lib/trpc";
import { type } from "arktype";
import { safeGenerateText } from "@/ai";
import { ErrorCode, errorResponse } from "@/lib/error";
import { Tools } from "@/lib/mcp/tools";
import { createUserWallet, getUserWallet } from "@/wallet";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { UserService } from "@/lib/user";
import { PriceModule } from "@/lib/modules/price";
import { db } from "@/db";
import { financeSummary } from "@/db/schema";
import { desc } from "drizzle-orm";

const userService = new UserService();
const priceModule = new PriceModule();

const walletRouter = router({
  create: protectedProcedure.input(type({})).mutation(async ({ ctx }) => {
    const userWallet = await getUserWallet({ userId: 1 }); // FIXME: Temprorary thing
    if (!userWallet) {
      console.log("test", userWallet);
    }
    return {
      wallet: userWallet || (await createUserWallet({ userId: 1000 })),
      ok: true,
    };
  }),
});

const authRouter = router({
  getNonce: publicProcedure.query(() => {
    return {
      nonce: siweService.generateNonce(),
    };
  }),

  getMessage: publicProcedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
        chainId: z.number().min(1),
        nonce: z.string(),
        domain: z.string().optional().default("localhost:3000"),
        uri: z.string().url().optional().default("http://localhost:3000"),
      }),
    )
    .query(({ input }) => {
      const message = siweService.createMessage({
        address: input.address,
        domain: input.domain,
        uri: input.uri,
        version: "1",
        chainId: input.chainId,
        nonce: input.nonce,
        statement: "Sign in to authenticate your wallet",
      });

      return {
        message: message.prepareMessage(),
      };
    }),

  // Verify signature and return access token
  verifySignature: publicProcedure
    .input(
      z.object({
        message: z.string(),
        signature: z
          .string()
          .regex(/^0x[a-fA-F0-9]+$/, "Invalid signature format"),
      }),
    )
    .mutation(async ({ input }) => {
      const verification = await siweService.verifyMessage(
        input.message,
        input.signature,
      );

      if (!verification.success || !verification.data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: verification.error || "Signature verification failed",
        });
      }

      const dbUser = await userService.findOrCreateUser(
        verification.data.address,
      );
      const user = {
        id: dbUser.id,
        address: verification.data.address,
        chainId: verification.data.chainId,
        issuedAt: verification.data.issuedAt || new Date().toISOString(),
      };

      const accessToken = jwtService.generateToken(user);

      return {
        accessToken,
        user,
      };
    }),

  // Refresh token
  refreshToken: protectedProcedure.mutation(async ({ ctx }) => {
    const dbUser = await userService.getUserById(ctx.user.id);

    if (!dbUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const newToken = jwtService.generateToken({
      id: ctx.user.id,
      address: ctx.user.address,
      chainId: ctx.user.chainId,
      issuedAt: new Date().toISOString(),
    });

    return {
      accessToken: newToken,
    };
  }),
});

const financeRouter = router({
  getPrice: publicProcedure.query(async () => {
    const tokenPrices = await priceModule.getPrices(priceModule.getTopCoins());
    return { ok: true, tokenPrices };
  }),
  getAiSummary: publicProcedure.query(async () => {
    const message = await db
      .select()
      .from(financeSummary)
      .orderBy(desc(financeSummary.createdAt))
      .limit(1);
    return { ok: true, message };
  }),
});

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  prompt: publicProcedure
    .input(type({ message: "string" }))
    .mutation(async (c) => {
      const tools = new Tools().getTools();

      const text = await safeGenerateText({
        messages: [
          {
            role: "user",
            content: c.input.message,
          },
        ],
        tools,
      });

      if (text.isErr()) {
        return errorResponse(text.error, ErrorCode.PROMPT_ERROR);
      }

      return { ok: true, text };
    }),
  wallets: walletRouter,
  auth: authRouter,
  finance: financeRouter,
});

export type AppRouter = typeof appRouter;
