import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import config from "../config";
import jwt from "jsonwebtoken";
import {
  EncodedProfileTokenClaims,
  IAuthCtx,
  IAuthPassportCallbackCtx,
  SupernovaResponse,
} from "../types";
import { authenticateJWTMiddleware } from "../mws";
import { prisma, redis } from "../db";

export const buildAuthRouter = () => {
  const router = express.Router();

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
          // create another access token with the sub as the user ID
          // this is client-side
          const jwtAccessToken = jwt.sign(
            { sub: upsertedUser.id },
            config.JWT_SECRET
          );
          // store the refresh token in redis
          try {
            await redis.connect();
            const resset = await redis.set(upsertedUser.id, jwtAccessToken);
            await redis.disconnect();
            if (resset !== "OK") {
              return res.status(500).send(
                new SupernovaResponse({
                  error: "Internal Server Error",
                  message: "Failed to create user session",
                })
              );
            }
            // send back the access token
            res.cookie("accessToken", jwtAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
            res.redirect(config.SUPERNOVA_WEB_APP_BASE_URL);
          } catch (err) {
            console.error(err);
            return res.status(500).send(
              new SupernovaResponse({
                error: "Internal Server Error",
                message: "Failed to create user session",
              })
            );
          }
        } catch (err) {
          console.error(err);
          res.status(500).send(
            new SupernovaResponse({
              error: "Internal Server Error",
              message: "Failed to create user profile",
            })
          );
        }
      }
    }
  );

  // endpoint to authenticate the user; used by the web app to check if the user is logged in or not
  router.get("/auth", authenticateJWTMiddleware, async (req, res) => {
    const claims = req.user as IAuthCtx;
    res.json(
      new SupernovaResponse({
        data: {
          userId: claims.sub,
        },
      })
    );
  });

  router.get("/auth/logout", authenticateJWTMiddleware, async (req, res) => {
    const userAuthCtx = req.user as IAuthCtx;
    console.log(userAuthCtx);
    // delete the refresh token from redis (stored as a KV pair of user ID -> refresh token)
    if (userAuthCtx.sub === undefined) {
      console.error("userAuthCtx.sub is undefined");
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
      return res.status(400).send(
        new SupernovaResponse({
          error: "Bad Request",
          message: "Failed to logout user because user has no session",
        })
      );
    }
    return res.status(200).send(
      new SupernovaResponse({
        message: "User logged out",
      })
    );
  });

  return router;
};
