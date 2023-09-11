import express from "express";
import passport from "passport";
import config from "./config";
import PinoHTTP from "pino-http";
import {
  EncodedProfileTokenClaims,
  IAuthCtx,
  IAuthPassportCallbackCtx,
  SupernovaResponse,
} from "./types";
import { ISupernovaTask } from "@supernova/types";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticateJWTMiddleware } from "./mws";
import { prisma } from "./db";
import { buildAuthRouter } from "./routers/auth";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

export const createApp = () => {
  const logger = PinoHTTP();
  const app = express();
  app.use(logger);
  app.use(passport.initialize());
  app.use(
    cors({
      origin: config.SUPERNOVA_WEB_APP_BASE_URL, // enable cors for the web app
      credentials: true, // accept cookies from clients
    })
  );
  app.use(cookieParser()); // parses the cookies because apparently express doesn't do this by default

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

  // get all tasks belonging to the user
  app.get("/tasks", authenticateJWTMiddleware, async (req, res) => {
    const userId = (req.user as IAuthCtx).sub;
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
    });
    res.json(
      new SupernovaResponse<ISupernovaTask[]>({
        data: tasks.map((t) => ({
          id: t.id,
          originalBuildText: t.title, // TODO: incorporate this into the database schema
          title: t.title,
          isComplete: t.done,
          description: t.description ?? undefined,
          startAt: t.startAt ?? undefined,
          expectedDurationSeconds: t.expectedDurationSeconds ?? undefined,
          userId: t.userId,
        })),
      })
    );
  });

  // use auth router
  app.use(buildAuthRouter());

  return { app };
};

// run the server when not testing, because test is run in a separate file
if (process.env.NODE_ENV !== "test") {
  const { app } = createApp();
  app.listen(config.PORT, () => {
    console.log(`Listening on port ${config.PORT}`);
  });
}
