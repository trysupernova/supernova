export interface ISupernovaTask {
  id: string;
  title: string;
  originalBuildText: string;
  description?: string;
  expectedDurationSeconds?: number; // in seconds
  startTime?: Date;
  startDate?: Date;
  isComplete: boolean;
  createdAt: Date;
}

type TErrorResponse = {
  type: "error";
  statusCode: number;
  error: string;
  message?: string;
};

type TDataResponse<T> = {
  type: "data";
  data: T;
  message?: string;
  statusCode: number;
};

export type TSupernovaResponse<T = any> = TErrorResponse | TDataResponse<T>;

export interface Converter<T, U> {
  convert: (t: T) => U;
}

export * from "./schema";
