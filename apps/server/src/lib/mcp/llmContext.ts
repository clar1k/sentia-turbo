import { db } from "@/db";
import { DeFiModule } from "../modules/defi";
import { PriceModule } from "../modules/price";
import { contextData } from "@/db/schema";
import { gte } from "drizzle-orm";
import { ContextsEnum } from "types";

interface ContextGenerationOptions {
  include: ContextsEnum[];
}

interface GetContextOptions {
  deadline: number;
  type: ContextsEnum;
}

type ContextType = Record<string, any>;
type ContextsListResultType =
  | Record<ContextsEnum, ContextType>
  | Record<string, any>;

export class LlmContext {
  async generateContext(options: ContextGenerationOptions) {
    const result: ContextsListResultType = {};

    if (options.include.includes(ContextsEnum.defi)) {
      const module = new DeFiModule();
      result[ContextsEnum.defi] = {
        protocols: module.getDefaultProtocols(),
        totalTvl: module.calculateTotalTvl(),
        chain: module.getChainsTvl(),
      };
    }
    if (options.include.includes(ContextsEnum.finance)) {
      const module = new PriceModule();
      const listOfCoins = module.getTopCoins();
      result[ContextsEnum.finance] = await module.getPrices(listOfCoins);
    }

    return result;
  }

  async saveContext({
    data,
    type,
  }: {
    data: Record<string, any>;
    type: ContextsEnum;
  }) {
    await db.insert(contextData).values({ data, type });
  }

  async getContext(options: GetContextOptions) {
    const deadlineTime = new Date(options.deadline);
    const cachedContexts = await db
      .select()
      .from(contextData)
      .where(gte(contextData.createdAt, deadlineTime));
    const cachedContext = cachedContexts.find(
      (obj) => obj.type === options.type.toString(),
    );
    console.log(cachedContexts);
    console.log(cachedContext);

    let context: ContextType;
    if (!cachedContext) {
      const generatedContext = await this.generateContext({
        include: [options.type],
      });
      context = generatedContext[options.type];
      this.saveContext({ data: context, type: options.type });
    } else {
      context = cachedContext.data as ContextType;
    }

    return context;
  }
}
