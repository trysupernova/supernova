import { Profile } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

export interface ISupernovaResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export class SupernovaResponse<T> implements ISupernovaResponse<T> {
  data?: T;
  error?: string;
  message?: string;

  constructor({
    data,
    error,
    message,
  }: {
    data?: T;
    error?: string;
    message?: string;
  }) {
    this.data = data;
    this.error = error;
    this.message = message;
  }
}

// for storing the auth context passed around in the Passport flows
export interface IAuthPassportCallbackCtx {
  encodedProfileToken: string;
}

// this is the claims in the encodedProfileToken; decoding it will yield a claim looking like this
export type EncodedProfileTokenClaims = { user: Profile } & jwt.JwtPayload;

// for storing auth context for the typical request protected by our JWT middleware
// sub is the user ID which will be string since the @authenticateJWTMiddleware middleware
// will verify that the token is valid and has a sub claim
export type IAuthCtx = jwt.JwtPayload & { sub: string };
