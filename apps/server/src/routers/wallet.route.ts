import { protectedProcedure, router } from "@/lib/trpc";
import { createUserWallet, getUserWallet } from "@/wallet";
import { type } from "arktype";

export const walletRouter = router({
  create: protectedProcedure
    .input(type({}))
    .mutation(async ({ ctx }) => {
      const userWallet = await getUserWallet({ userId: ctx.user.id }); // FIXME: Temprorary thing
      return { wallet: userWallet || await createUserWallet({ userId: ctx.user.id }), ok: true };
    }),
});