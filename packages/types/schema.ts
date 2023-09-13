import { AnyZodObject, z } from "zod";

// any validation schema
export type SupernovaRequestValidationSchema = z.ZodObject<{
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}>;

const dateString = () =>
  z.string().refine((value) => {
    return !isNaN(Date.parse(value));
  }, "Invalid date string");

export const createTaskRequestSchema = z.object({
  body: z.object({
    title: z.string(),
    originalBuildText: z.string(),
    description: z.string().optional(),
    startAt: dateString().optional(),
    expectedDurationSeconds: z.number().positive().int().optional(),
  }),
});
export type CreateTaskRequest = z.infer<typeof createTaskRequestSchema>;

// if it's null then on the backend it will be cleared on the backend
export const updateTaskRequestSchema = z.object({
  body: z.object({
    title: z.string().optional(), // this is not nullable because a task must have a title
    originalBuildText: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    startAt: dateString().nullable().optional(),
    expectedDurationSeconds: z.number().positive().int().nullable().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
export type UpdateTaskRequest = z.infer<typeof updateTaskRequestSchema>;

export const deleteTaskRequestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type DeleteTaskRequest = z.infer<typeof deleteTaskRequestSchema>;

export const toggleCompleteTaskRequestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
export type ToggleCompleteTaskRequest = z.infer<
  typeof toggleCompleteTaskRequestSchema
>;
