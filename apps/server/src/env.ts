import { ArkErrors, type } from "arktype";

const envType = type({
  OPENROUTER_API_KEY: "string",
  DATABASE_URL: "string",
  DYNAMIC_API_KEY: "string",
});

const env = envType(process.env) as typeof envType.infer;

if (env instanceof ArkErrors) {
  throw env;
}

export { env };
