import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import cron from "node-cron";
import { finance } from "@/schedule/finance";
import { defi } from "@/schedule/defi";
import { news } from "./schedule/news";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ req: context.req });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

cron.schedule("0 0 * * *", () => {
  console.log("START");
  finance().then(() => console.log("finance DONE"));
  defi().then(() => console.log("defi DONE"));
});

cron.schedule("*/30 * * * *", () => {
  console.log("started cron news");
  news().then(() => console.log("news DONE"));
});

serve(app);
