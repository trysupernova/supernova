import express from "express";
import passport from "passport";
import config from "./config";
import PinoHTTP from "pino-http";
import { EncodedProfileTokenClaims, IAuthPassportCallbackCtx } from "./types";
import cors from "cors";
import cookieParser from "cookie-parser";
import { buildAuthRouter } from "./routers/auth";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { buildTasksRouter } from "./routers/tasks";
import { loggerOptions } from "./logging";

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

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (_accessToken, _refreshToken, profile, cb) => {
        // generate a JWT that encodes the user's OAuth profile
        // so that we can use it later in the callback to create / update the user
        const encodedProfileToken = jwt.sign(
          { user: profile } as EncodedProfileTokenClaims,
          config.JWT_SECRET
        );

        // Send tokens towards provider for callback later
        return cb(null, <IAuthPassportCallbackCtx>{
          encodedProfileToken,
        });
      }
    )
  );

  // use auth router
  app.use(buildAuthRouter());
  app.use(buildTasksRouter());

  return { app };
};

// run the server when not testing, because test is run in a separate file
if (process.env.NODE_ENV !== "test") {
  const { app } = createApp();
  app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
  });
}
