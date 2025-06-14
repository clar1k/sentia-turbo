import { protectedProcedure, router } from "@/lib/trpc";

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
