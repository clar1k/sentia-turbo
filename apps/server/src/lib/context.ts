import type { Context as HonoContext } from "hono";
import { JWTService } from '../lib/jwt';
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export type CreateContextOptions = {
  context: HonoContext;
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const jwtService = new JWTService();

export async function createContext({ context }: CreateContextOptions) {
  const getUser = () => {
    const authHeader = context.req.header().authorization || "";
    if (!authHeader?.startsWith('Bearer ')) return null;
    
    const token = authHeader.substring(7);
    return jwtService.verifyToken(token);
  };

  return {
    user: getUser(),
  };
};
