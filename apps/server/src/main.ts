import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import cron from "node-cron";
import { finance } from "@/schedule/finance";
import {defiRouters} from "@/routers/defi.routers";
import {defi} from "@/schedule/defi";

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

app.route('/finance', financeRoute);
app.route('/defi', defiRouters);

cron.schedule('0 0 * * *', () => {
  console.error("START")
  finance().then(() => (console.log("DONE")));
  defi().then(() => (console.log("DONE")));
})

export default app;
