import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {financeRoute} from "@/routers/finance.route";
import cron from 'node-cron';
import {finance} from "@/schedule/finance";
import { defi } from "./schedule/defi";

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


cron.schedule('0 0 * * *', () => {
  console.log("START");
  finance().then(() => (console.log("finance DONE")));
  defi().then(() => (console.log("defi DONE")));
})

cron.schedule('* * * * *', () => {
  news().then(() => (console.log("news DONE")));
})

export default app;
