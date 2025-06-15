import { env } from "@/env";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Result, ResultAsync } from "neverthrow";
import * as ai from "ai";
import { Tools } from "@/lib/mcp/tools";
import type { streamText } from "ai";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

export enum Models {
  GPT_4_MINI = "GPT_4_MINI",
  GPT_O3 = "GPT_O3",
  SONNET_4 = "SONNET_4",
}

const models: Record<Models, any> = {
  GPT_4_MINI: openrouter("openai/gpt-4.1-mini"),
  GPT_O3: openrouter("openai/o3"),
  SONNET_4: openrouter("anthropic/claude-sonnet-4"),
};

export type SupportedModel = keyof typeof models;

type GenerateTextOptions = Omit<
  Parameters<typeof ai.generateText>[0],
  "model"
> & {
  modelName?: SupportedModel;
};

type StreamTextOptions = Omit<
  Parameters<typeof streamText>[0],
  "model"
> & {
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
  ).map((result) => {
    console.log('toolResults:', result.toolResults);

    if (result.toolResults && result.toolResults.length > 0) {
      const toolOutputs = result.toolResults
        .map((toolResult) => (toolResult as any).result) // TODO: FIX this. Idk why it has type never
        .join('\n\n');
      
      return {
        ...result,
        text: result.text + '\n\n' + toolOutputs
      };
    }

    return result;
  });
};


const throwableStreamText = Result.fromThrowable(
  ai.streamText,
  (error) => error as ai.AISDKError,
);

export const safeStreamText = (options: StreamTextOptions) => {
  const model = models[options.modelName ?? "GPT_4_MINI"];
  return throwableStreamText({
      model,
      ...options,
    })
};
