import {
  CreateTaskRequest,
  ISupernovaTask,
  SupernovaResponse,
  UpdateTaskRequest,
} from "@supernova/types";
import {
  supernovaResponseConverter,
  supernovaTaskConverter,
} from "./converters";

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
      .then(supernovaResponseConverter.convert)
      .then((response) => {
        if (response.type === "data") {
          return {
            ...response,
            data: response.data.map(supernovaTaskConverter.convert),
          };
        }
        return response;
      });
  }

  public addTask(request: CreateTaskRequest): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request.body),
    }).then(supernovaResponseConverter.convert);
  }

  public updateTask(request: UpdateTaskRequest): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks/${request.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request.body),
    }).then(supernovaResponseConverter.convert);
  }

  public deleteTask(id: string): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }

  public authenticate(): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }

  logout(): Promise<SupernovaResponse> {
    return fetch(`${this.baseUrl}/auth/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }
}
