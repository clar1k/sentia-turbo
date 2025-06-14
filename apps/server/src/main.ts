import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import cron from 'node-cron';
import {finance} from "@/schedule/finance";
import { defi } from "./schedule/defi";
import { coindeskNews } from "./schedule/news";
// import { WebSocketServer } from "ws";
import { createBunWebSocket } from 'hono/bun'

const app = new Hono();
const { websocket, upgradeWebSocket } = createBunWebSocket()

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

// const wss = new WebSocketServer({ noServer: true });

app.get("/", (c) => {
  return c.text("OK");
});

const topic = "";

// app.get(
//   "/ws",
//   upgradeWebSocket((c) => {
//     return {
//       onOpen: (event, ws) => {
//         console.log("WebSocket connection opened");
//         wss.emit("connection", ws, c.req.raw);
//       },
//       onClose: (event, ws) => {
//         console.log("WebSocket connection closed");
//       },
//       onError: (event, ws) => {
//         console.error("WebSocket error:", event);
//       },
//     };
//   }),
// );


cron.schedule('0 0 * * *', () => {
  console.log("START");
  finance().then(() => (console.log("finance DONE")));
  defi().then(() => (console.log("defi DONE")));
})

cron.schedule('*/30 * * * *', () => {
  coindeskNews().then(() => (console.log("news DONE")));
})

// const server = Bun.serve({
//   port: 3000,
//   fetch: app.fetch,
//   websocket: websocket,
// });

export default app;
