import { Router } from "express";
import passport from "passport";
import config from "../config";
import jwt from "jsonwebtoken";
import {
  EncodedProfileTokenClaims,
  IAuthPassportCallbackCtx,
  SupernovaResponse,
} from "../types";
import { authenticateJWTMiddleware } from "../mws";
import { redis } from "../db";
import { logger } from "../logging";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getAuthContext } from "../utils";
import { createUserAccessToken, upsertUser } from "../services/user";

const FOREVER_IN_MS = 1000 * 60 * 60 * 24 * 365 * 10;

export default function buildAuthRouter(): Router {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.THIS_URL}/auth/google/callback`,
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

  const router = Router();

  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  // handle callback from google
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    async (req, res) => {
      const callbackAuthCtx = req.user as IAuthPassportCallbackCtx;
      // decode the user from the access token
      const decoded = jwt.decode(
        callbackAuthCtx.encodedProfileToken
      ) as EncodedProfileTokenClaims;
      // upsert the user if they have emails
      // else reject their request
      const firstEmailOrNone = decoded.user.emails?.at(0)?.value;
      if (firstEmailOrNone) {
        try {
          const upsertedUser = await upsertUser({
            email: firstEmailOrNone,
            displayName: decoded.user.displayName,
          });
          // create the real user access token with the sub as the user ID
          // this is client-side
          const jwtAccessToken = createUserAccessToken(upsertedUser.id);
          // store the refresh token in redis
          try {
            await redis.connect();
            const resset = await redis.set(upsertedUser.id, jwtAccessToken);
            await redis.disconnect();
            if (resset !== "OK") {
              logger.error(
                `Setting user token in Redis failed. user=${upsertedUser.id} token=${jwtAccessToken}`
              );
              return res.status(500).send(
                new SupernovaResponse({
                  error: "Internal Server Error",
                  message: "Failed to create user session",
                })
              );
            }
            // send back the access token in a cookie
            // lasts forever
            res.cookie("accessToken", jwtAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: new Date(Date.now() + FOREVER_IN_MS),
            });
            res.redirect(config.SUPERNOVA_WEB_APP_BASE_URL);
          } catch (err) {
            logger.error(err);
            return res.status(500).send(
              new SupernovaResponse({
                error: "Internal Server Error",
                message: "Failed to create user session",
              })
            );
          }
        } catch (err) {
          logger.error(err);
          res.status(500).send(
            new SupernovaResponse({
              error: "Internal Server Error",
              message: "Failed to create user profile",
            })
          );
        }
      } else {
        // reject the request
        return res.status(400).send(
          new SupernovaResponse({
            error: "Bad Request",
            message:
              "Sorry; from our side, your Google account does not seem to have any associated emails. This might be an issue on our side or it could be an error with Google's authentication. Please double-check your Google account, try again later, or send us an email at <vincent@trysupernova.one> for support if you tried everything and it doesn't work",
          })
        );
      }
    }
  );

  // endpoint to authenticate the user; used by the web app to check if the user is logged in or not
  router.get("/auth", authenticateJWTMiddleware, async (req, res) => {
    const claims = getAuthContext(req);
    res.json(
      new SupernovaResponse({
        data: {
          userId: claims.sub,
        },
      })
    );
  });

  router.get(
    "/auth/logout",
    authenticateJWTMiddleware,
    async (req, res, next) => {
      try {
        const userAuthCtx = getAuthContext(req);
        // delete the refresh token from redis (stored as a KV pair of user ID -> refresh token)
        if (userAuthCtx.sub === undefined) {
          logger.error(
            `userAuthCtx.sub is undefined; userAuthCtx=${JSON.stringify(
              userAuthCtx
            )}`
          );
          return res.status(400).send(
            new SupernovaResponse({
              error: "Internal Server Error",
              message: "Failed to logout user",
            })
          );
        }
        await redis.connect();
        const resdel = await redis.del(userAuthCtx.sub);
        await redis.disconnect();
        // didn't delete anything
        if (resdel === 0) {
          return res.status(200).send(
            new SupernovaResponse({
              message: "User has already been logged out",
            })
          );
        }
        return res.status(200).send(
          new SupernovaResponse({
            message: "User logged out",
          })
        );
      } catch (err) {
        return next(err);
      }
    }
  );

  return router;
}
