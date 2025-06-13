import type { ToolExecutionOptions, ToolSet } from "ai";

function toolExecuteWrapper() {
  return (args: any, options: ToolExecutionOptions) => 
}


export class Tools {
  getTools(): ToolSet  {
    return {
      [ContextsEnum.defi]: {
        id: ContextsEnum.defi,
        type: "function",
        description: "Returns data, info about protocols, total TVL",
      } 
    }
  }
}