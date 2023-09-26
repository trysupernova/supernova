import {
  Converter,
  TSupernovaResponse,
  ISupernovaTask,
} from "@supernova/types";

export const supernovaResponseConverter: Converter<
  Response,
  Promise<TSupernovaResponse>
> = {
  convert: async (r) => {
    const json = await r.json();
    if (json.error)
      return {
        type: "error",
        error: json.error,
        message: json.message,
        statusCode: r.status,
      };
    return {
      type: "data",
      data: json.data,
      error: json.error,
      message: json.message,
      statusCode: r.status,
    };
  },
};

const nullToUndefined = (v: any) => (v === null ? undefined : v);

export const supernovaTaskConverter: Converter<any, ISupernovaTask> = {
  convert: (t) => ({
    id: t.id,
    originalBuildText: t.originalBuildText,
    title: t.title,
    description: nullToUndefined(t.description),
    expectedDurationSeconds: nullToUndefined(t.expectedDurationSeconds),
    startTime: t.startAt ? new Date(t.startAt) : undefined,
    isComplete: t.done,
  }),
};
