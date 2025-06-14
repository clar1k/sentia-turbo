import type { Context as HonoContext, HonoRequest } from "hono";
import { JWTService, verifyDynamicJWT } from '../lib/jwt';
import type { JwtPayload } from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { UserService } from "./user";

export type CreateContextOptions = {
  context: HonoContext;
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const userService = new UserService();

export async function createContext({ req }: { req: HonoRequest }) {
  const auth = req.header()['authorization'] ?? '';
  const token = auth.startsWith('Bearer ')
    ? auth.slice('Bearer '.length)
    : null;

  if (!token) {
    // no token → anonymous
    return { user: null, dynamicPayload: null };
  }

  let payload: JwtPayload;
  try {
    const verifiedToken = await verifyDynamicJWT(token);
    if (!verifiedToken) throw new Error("Token is invalid");
    payload = verifiedToken;
  } catch (err) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }

  const address = payload.sub as string;
  const dbUser = await userService.findOrCreateUser(address);
  return {
    user: { id: dbUser.id, address },
    dynamicPayload: payload,
  };
};
