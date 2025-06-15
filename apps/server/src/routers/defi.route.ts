import { db } from "@/db";
import { defiSummary } from "@/db/schema";
import { protectedProcedure, router } from "@/lib/trpc";
import { desc } from "drizzle-orm";

export const defiRouter = router({
  getAiSummary: protectedProcedure.query(async () => {
    const message = await db
      .select()
      .from(defiSummary)
      .orderBy(desc(defiSummary.createdAt))
      .limit(1);
    return { ok: true, message };
  }),
});