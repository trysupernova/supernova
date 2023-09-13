export interface ISupernovaTask {
  id: string;
  title: string;
  originalBuildText: string;
  description?: string;
  expectedDurationSeconds?: number; // in seconds
  startTime?: Date;
  isComplete: boolean;
}

type ErrorResponse = {
  type: "error";
  statusCode: number;
  error: string;
  message?: string;
};

type DataResponse<T> = {
  type: "data";
  data: T;
  message?: string;
  statusCode: number;
};

export type SupernovaResponse<T = any> = ErrorResponse | DataResponse<T>;

export interface Converter<T, U> {
  convert: (t: T) => U;
}

export * from "./schema";
