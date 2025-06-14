import { env } from "@/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ResultAsync } from "neverthrow";
import * as ai from "ai";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const models: Record<string, any> = {
  GPT_4_MINI: openrouter("openai/gpt-4.1-mini"),
  GPT_O3: openrouter("openai/o3"),
  SONNET_4: openrouter("anthropic/claude-sonnet-4"),
};

export type SupportedModel = keyof typeof models;

type GenerateTextOptions = Omit<Parameters<typeof ai.generateText>[0], "model"> & {
  modelName?: SupportedModel;
};

export const safeGenerateText = async (options: GenerateTextOptions) => {
  const model = models[options.modelName ?? "GPT_4_MINI"];
  return ResultAsync.fromPromise(
    ai.generateText({
      model,
      ...options,
    }),
    (error) => error as ai.AISDKError | ai.APICallError,
  );
};
