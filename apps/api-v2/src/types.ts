import { Profile } from "passport-google-oauth20";

export interface ISupernovaResponse<T extends any> {
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
  accessToken: string;
}

// for storing auth context for the typical request protected by our JWT middleware
export interface IAuthCtx {
  user: Profile;
}
