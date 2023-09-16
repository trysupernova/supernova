import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import config from "./config";

export const prisma = new PrismaClient();

export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on("error", (err) => {
  console.error(err);
});
