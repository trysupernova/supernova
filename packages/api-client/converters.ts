import { Converter, SupernovaResponse, ISupernovaTask } from "@supernova/types";

export const supernovaResponseConverter: Converter<
  Response,
  Promise<SupernovaResponse>
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

export const supernovaTaskConverter: Converter<any, ISupernovaTask> = {
  convert: (t) => ({
    id: t.id,
    originalBuildText: t.originalBuildText,
    title: t.title,
    description: t.description,
    expectedDurationSeconds: t.expectedDurationSeconds,
    startTime: t.startTime,
    isComplete: t.isComplete,
  }),
};
