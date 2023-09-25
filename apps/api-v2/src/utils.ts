import { Request } from "express";
import { IAuthCtx } from "./types";

/**
 * Get the auth context which contains information about requesting user.
 * @param req Express-like request object
 * @returns auth context object
 */
export function getAuthContext(req: Request): IAuthCtx {
  return req.user as IAuthCtx;
}
