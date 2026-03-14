import { env } from "@core/env/server";
import arcjet from "@arcjet/node";

export const aj = arcjet({
  key: env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [],
});

export { arcjet };
export type { ArcjetDecision, ArcjetRuleResult } from "@arcjet/node";
