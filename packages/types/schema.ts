import { z } from "zod";

const dateString = () =>
  z.string().refine((value) => {
    return !isNaN(Date.parse(value));
  }, "Invalid date string");

export const createTaskRequestSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    startAt: dateString().optional(),
    expectedDurationSeconds: z.number().positive().int().optional(),
  }),
});
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;
