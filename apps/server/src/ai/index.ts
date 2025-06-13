import { env } from "@/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ResultAsync } from "neverthrow";
import * as ai from "ai";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const model = openrouter("openai/gpt-4.1-mini"); // model for test

type GenerateTextOptions = Omit<Parameters<typeof ai.generateText>[0], "model">;

export const safeGenerateText = async (options: GenerateTextOptions) => {
  return ResultAsync.fromPromise(
    ai.generateText({
      model,
      ...options,
    }),
    (error) => error as ai.AISDKError | ai.APICallError
  );
};
