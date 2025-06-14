import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { SIWEService } from "./siwe";
import { JWTService } from "./jwt";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const siweService = new SIWEService();
export const jwtService = new JWTService();

// Middleware for protected routes
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

