import { env } from "@core/env/server";
import Redis from "ioredis";

export function createRedis(url?: string) {
  return new Redis(url ?? env.REDIS_URL ?? "redis://localhost:6379");
}

export const redis = createRedis();

export { Redis };
