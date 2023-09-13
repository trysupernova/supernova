import dotenv from "dotenv";
import { parseEnv, z } from "znv";

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  dotenv.config();
}

const config = parseEnv(process.env, {
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  PORT: z.number().int().positive().default(3000),
  SUPERNOVA_WEB_APP_BASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  REDIS_URL: z.string().min(1),
});

export default config;
