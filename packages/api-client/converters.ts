import { Converter, SupernovaResponse, ISupernovaTask } from "@supernova/types";

export const supernovaResponseConverter: Converter<any, SupernovaResponse> = {
  convert: (r) => {
    if (r.error) return { type: "error", error: r.error, message: r.message };
    return {
      type: "data",
      data: r.data,
      error: r.error,
      message: r.message,
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
