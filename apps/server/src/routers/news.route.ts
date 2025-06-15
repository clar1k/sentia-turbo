import { db } from "@/db";
import { newsSummary } from "@/db/schema";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import z from "zod";

export const newsRouter = router({
  list: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    return db.select().from(newsSummary).limit(5);
  }),
});
