import type { publicProcedure } from "@/lib/trpc";
import type { Context } from "hono";

export enum ErrorCode {
  PROMPT_ERROR = "propmt_error",
}

export const errorResponse = async (error: Error, label: ErrorCode) => {
  return { ok: false, error: label };
};
