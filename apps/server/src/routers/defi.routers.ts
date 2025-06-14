import {db} from "@/db";
import {Hono} from "hono";
import {defiSummary} from "@/db/schema";
import {desc} from "drizzle-orm";

export const defiRouters = new Hono()
  .get('/ai-summary', async (ctx) => {
    const message = await db.select().from(defiSummary).orderBy(desc(defiSummary.createdAt)).limit(1);
    return ctx.json({ok: true, message}, 200);
  });
