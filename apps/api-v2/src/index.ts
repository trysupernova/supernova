import express from "express";
import passport from "passport";
import config from "./config";
import PinoHTTP from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import buildAuthRouter from "./routers/auth";
import buildTasksRouter from "./routers/tasks";
import buildStatsRouter from "./routers/stats";
import { loggerOptions } from "./logging";
import responseTime from "response-time";

export const createApp = () => {
  const app = express();

  const mwLogger = PinoHTTP(loggerOptions);
  app.use(mwLogger);
  app.use(passport.initialize());
  app.use(
    cors({
      origin: config.SUPERNOVA_WEB_APP_BASE_URL, // enable cors for the web app
      credentials: true, // accept cookies from clients
    })
  );
  app.use(cookieParser()); // parses the cookies because apparently express doesn't do this by default
  app.use(express.json()); // parses the request body
  const responseTimeMws = responseTime();
  app.use(responseTimeMws);

  // use auth router
  app.use(buildAuthRouter());
  app.use(buildTasksRouter());
  app.use(buildStatsRouter());

  return { app };
};

// run the server when not testing, because test is run in a separate file
if (process.env.NODE_ENV !== "test") {
  const { app } = createApp();
  app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
  });
}
