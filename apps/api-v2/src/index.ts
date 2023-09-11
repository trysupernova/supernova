import express from "express";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import passport from "passport";
import config from "./config";
import PinoHTTP from "pino-http";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { IAuthCtx, IAuthPassportCallbackCtx, SupernovaResponse } from "./types";
import { ISupernovaTask } from "@supernova/types";
import cors from "cors";
import cookieParser from "cookie-parser";

const prisma = new PrismaClient();

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
      // Generate JWT access and refresh tokens
      const jwtAccessToken = jwt.sign({ user: profile }, config.JWT_SECRET);

      // Send tokens to client
      return cb(null, <IAuthPassportCallbackCtx>{
        accessToken: jwtAccessToken,
      });
    }
  )
);

const authenticateJWTMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // use the authorization header or the cookie
  const token = req.headers.authorization ?? req.cookies?.accessToken;
  // verify if authHeader is valid
  if (token) {
    try {
      const user = jwt.verify(token, config.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).send(
        new SupernovaResponse({
          message: "Forbidden",
          error: "Invalid access token",
        })
      );
    }
  } else {
    return res.status(403).send(
      new SupernovaResponse({
        message: "Forbidden",
        error: "Invalid access token",
      })
    );
  }
};

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// handle callback from google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const userAuthCtx = req.user as IAuthPassportCallbackCtx;
    // decode the user from the access token
    const decoded = jwt.decode(userAuthCtx.accessToken) as { user: Profile };
    // upsert the user if they have emails
    // else reject their request
    const firstEmailOrNone = decoded.user.emails?.at(0)?.value;
    if (firstEmailOrNone) {
      try {
        const upsertedUser = await prisma.user.upsert({
          where: {
            email: firstEmailOrNone,
          },
          update: {},
          create: {
            email: firstEmailOrNone,
            name: decoded.user.displayName,
          },
        });
        // create another access token with sub as the user ID
        // this is client-side
        const jwtAccessToken = jwt.sign(
          { user: decoded.user, sub: upsertedUser.id },
          config.JWT_SECRET
        );
        // send back the access token
        res.cookie("accessToken", jwtAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.redirect(config.SUPERNOVA_WEB_APP_BASE_URL);
      } catch (err) {
        console.error(err);
        res.status(500).send(
          new SupernovaResponse({
            message: "Internal Server Error",
            error: "Failed to upsert user",
          })
        );
      }
    }
  }
);

// get all tasks belonging to the user
app.get("/tasks", authenticateJWTMiddleware, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: (req.user as IAuthCtx).user.emails?.at(0)?.value,
    },
  });
  res.json(
    new SupernovaResponse<ISupernovaTask[]>({
      data: tasks.map((t) => ({
        id: t.id,
        originalBuildText: t.title, // TODO: fix this
        title: t.title,
        description: t.description ?? undefined,
        isComplete: t.done,
        startAt: t.startAt,
        expectedDurationSeconds: t.expectedDurationSeconds ?? undefined,
        userId: t.userId,
      })),
    })
  );
});

// endpoint to authenticate the user; used by the web app to check if the user is logged in or not
app.get("/auth", authenticateJWTMiddleware, async (req, res) => {
  res.json(
    new SupernovaResponse({
      data: {
        user: (req.user as IAuthCtx).user,
      },
    })
  );
});

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
