import { db } from "@/db";
import { newsSummary } from "@/db/schema";
import { protectedProcedure, router } from "@/lib/trpc";
import { type } from "arktype";
import z from "zod";

export const newsRouter = router({
  list: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      return db.select().from(newsSummary).limit(5);
    }),
});
