import express from "express";
import { IAuthCtx, SupernovaResponse } from "./types";
import jwt from "jsonwebtoken";
import config from "./config";
import { redis } from "./db";

// TODO: redirect to the web app on errors instead of sending a JSON response
export const authenticateJWTMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // use the authorization header or the cookie
    const token = req.headers.authorization ?? req.cookies?.accessToken;
    // verify if authHeader is valid
    if (token) {
      try {
        const user = jwt.verify(token, config.JWT_SECRET) as IAuthCtx;
        if (user.sub === undefined) {
          return res.status(403).send(
            new SupernovaResponse({
              error: "Forbidden",
              message: "Token has no associated user ID",
            })
          );
        }
        // check if there's a session for this user
        await redis.connect();
        const resget = await redis.get(user.sub as string);
        await redis.disconnect();
        if (resget === null) {
          return res.status(403).send(
            new SupernovaResponse({
              error: "Forbidden",
              message: "User has no session",
            })
          );
        }
        // check if this is the current session i.e the token in the session and the token sent by the client match
        if (resget !== token) {
          return res.status(403).send(
            new SupernovaResponse({
              error: "Forbidden",
              message:
                "Invalid access token (provided access token does not match the one in the currently logged in session)",
            })
          );
        }
        // set the user in the request
        req.user = user;
        next();
      } catch (err) {
        return res.status(403).send(
          new SupernovaResponse({
            error: "Forbidden",
            message: "Invalid access token",
          })
        );
      }
    } else {
      return res.status(403).send(
        new SupernovaResponse({
          error: "Forbidden",
          message: "Invalid access token",
        })
      );
    }
  } catch (err) {
    console.error("Could not connect to Redis: " + err);
    return res.status(500).send(
      new SupernovaResponse({
        error: "Internal Server Error",
        message:
          "An error occurred while authenticating the user; this is on us, not you. Please try again later.",
      })
    );
  }
};
