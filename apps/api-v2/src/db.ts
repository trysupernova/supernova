import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import config from "./config";
import { logger } from "./logging";

export const prisma = new PrismaClient();

// TODO: use ioredis instead
export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on("error", (err) => {
  logger.error(err);
});
