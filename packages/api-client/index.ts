import { ISupernovaTask, SupernovaResponse } from "@supernova/types";
import { supernovaResponseConverter } from "./converters";

export default class SupernovaAPI {
  baseUrl: string;
  constructor(baseUrl = "https://api.trysupernova.one") {
    this.baseUrl = baseUrl;
  }

  public getGoogleOAuthUrl() {
    return `${this.baseUrl}/auth/google`;
  }

  public getTasks(): Promise<SupernovaResponse<ISupernovaTask[]>> {
    return fetch(`${this.baseUrl}/tasks`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(supernovaResponseConverter.convert);
  }

  public authenticate(): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(supernovaResponseConverter.convert);
  }
}
