import { Router } from "express";
import { authenticateJWTMiddleware, validateRequestSchema } from "../mws";
import { getAuthContext } from "../utils";
import { prisma } from "../db";
import { SupernovaResponse } from "../types";
import {
  createTaskRequestSchema,
  updateTaskRequestSchema,
} from "@supernova/types";

export const buildTasksRouter = () => {
  const router = Router();

  router.get("/tasks", authenticateJWTMiddleware, async (req, res) => {
    try {
      const authCtx = getAuthContext(req);
      // get all tasks for the user
      // sort by earliest one first; ones with no start time last
      const tasks = await prisma.task.findMany({
        orderBy: [
          {
            startAt: {
              sort: "asc",
              nulls: "last",
            },
          },
        ],
        where: {
          userId: authCtx.sub,
        },
      });
      return res.status(200).json(
        new SupernovaResponse({
          message: "Tasks fetched successfully",
          data: tasks,
        })
      );
    } catch (err) {
      let e = err as Error;
      return res.status(500).json(
        new SupernovaResponse({
          message: e.message,
          error: "Internal Server Error",
        })
      );
    }
  });

  // create task
  router.post(
    "/tasks",
    authenticateJWTMiddleware,
    validateRequestSchema(createTaskRequestSchema),
    async (req, res) => {
      try {
        const authCtx = getAuthContext(req);
        const task = await prisma.task.create({
          data: {
            title: req.body.title,
            originalBuildText: req.body.originalBuildText,
            description: req.body.description,
            startAt: req.body.startAt,
            expectedDurationSeconds: req.body.expectedDurationSeconds,
            userId: authCtx.sub,
          },
        });
        return res.status(200).json(
          new SupernovaResponse({
            message: "Task created successfully",
            data: task,
          })
        );
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          return res.status(500).json(
            new SupernovaResponse({
              message: e.message,
              error: "Internal Server Error",
            })
          );
        }
      }
    }
  );

  // update task
  // can also use this for marking task as done
  router.put(
    "/tasks/:id",
    authenticateJWTMiddleware,
    validateRequestSchema(updateTaskRequestSchema),
    async (req, res) => {
      try {
        const authCtx = getAuthContext(req);
        const task = await prisma.task.update({
          where: {
            id: req.params.id,
            userId: authCtx.sub,
          },
          data: {
            title: req.body.title,
            originalBuildText: req.body.originalBuildText,
            description: req.body.description,
            startAt: req.body.startAt,
            expectedDurationSeconds: req.body.expectedDurationSeconds,
          },
        });
        return res.status(200).json(
          new SupernovaResponse({
            message: "Task updated successfully",
            data: task,
          })
        );
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
          return res.status(500).json(
            new SupernovaResponse({
              message: e.message,
              error: "Internal Server Error",
            })
          );
        }
      }
    }
  );

  return router;
};
