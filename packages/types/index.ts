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
  error: string;
  message?: string;
};

type DataResponse<T> = {
  type: "data";
  data: T;
  message?: string;
};

export type SupernovaResponse<T = any> = ErrorResponse | DataResponse<T>;

export interface Converter<T, U> {
  convert: (t: T) => U;
}
