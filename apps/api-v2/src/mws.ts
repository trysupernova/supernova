import express, { Request, Response, NextFunction } from "express";
import { IAuthCtx, SupernovaResponse } from "./types";
import jwt from "jsonwebtoken";
import config from "./config";
import { redis } from "./db";
import { z } from "zod";
import { SupernovaRequestValidationSchema } from "@supernova/types";
import { logger } from "./logging";

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
        const user = jwt.verify(token, config.JWT_SECRET);
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
        req.user = user as IAuthCtx;
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
    logger.error("Could not connect to Redis: " + err);
    return res.status(500).send(
      new SupernovaResponse({
        error: "Internal Server Error",
        message:
          "An error occurred while authenticating the user; this is on us, not you. Please try again later.",
      })
    );
  }
};

/**
 * Validates the request body, query and params against the schema
 * @param schema the schema validating the request
 * @returns Express middleware
 */
export const validateRequestSchema =
  (schema: SupernovaRequestValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(
          new SupernovaResponse({
            message: "Invalid request; failed schema validation",
            error: error.toString(),
          })
        );
      }
      // log the error because this is unknown
      res.status(500).json(
        new SupernovaResponse({
          message: "Internal Server Error",
          error:
            "An error occurred while validating the request; this is on us, not you. Please try again later.",
        })
      );
      next(error);
    }
  };

/**
 * Generic error handler for the application.
 * Expect to have handled error response before this middleware
 * @param err
 * @param req
 * @param res
 * @param next
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);
  next();
}
