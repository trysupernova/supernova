import {
  CreateTaskRequest,
  ISupernovaTask,
  TSupernovaResponse,
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

  public getTasks(): Promise<TSupernovaResponse<ISupernovaTask[]>> {
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

  public addTask(request: CreateTaskRequest): Promise<TSupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request.body),
    }).then(supernovaResponseConverter.convert);
  }

  public updateTask(request: UpdateTaskRequest): Promise<TSupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks/${request.params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request.body),
    }).then(supernovaResponseConverter.convert);
  }

  public toggleCompleteTask(
    id: string
  ): Promise<TSupernovaResponse<ISupernovaTask>> {
    return fetch(`${this.baseUrl}/tasks/${id}/toggle-complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(supernovaResponseConverter.convert)
      .then((res) => {
        if (res.type === "data") {
          return {
            ...res,
            data: supernovaTaskConverter.convert(res.data),
          };
        }
        return res;
      });
  }

  public deleteTask(id: string): Promise<TSupernovaResponse> {
    return fetch(`${this.baseUrl}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }

  public authenticate(): Promise<TSupernovaResponse> {
    return fetch(`${this.baseUrl}/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }

  logout(): Promise<TSupernovaResponse> {
    return fetch(`${this.baseUrl}/auth/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(supernovaResponseConverter.convert);
  }
}
