import { Request } from "express";
import { IAuthCtx } from "./types";

export const getAuthContext = (req: Request): IAuthCtx => {
  return req.user as IAuthCtx;
};
