import { Router } from "express";
import { authenticateJWTMiddleware, validateRequestSchema } from "../mws";
import { getAuthContext } from "../utils";
import { prisma } from "../db";
import { SupernovaResponse } from "../types";
import {
  createTaskRequestSchema,
  deleteTaskRequestSchema,
  toggleCompleteTaskRequestSchema,
  updateTaskRequestSchema,
} from "@supernova/types";

export default function buildTasksRouter(): Router {
  const router = Router();

  router.get("/tasks", authenticateJWTMiddleware, async (req, res, next) => {
    try {
      const authCtx = getAuthContext(req);
      // get all tasks for the user
      // sort by earliest one first; ones with no start time last
      // also put all the done ones at the end
      // do not include deleted tasks (i.e those with deletedAt not null)
      const tasks = await prisma.task.findMany({
        orderBy: [
          {
            done: "asc",
          },
          {
            startAt: {
              sort: "asc",
              nulls: "last",
            },
          },
        ],
        where: {
          userId: authCtx.sub,
          deletedAt: null,
        },
      });
      return res.status(200).json(
        new SupernovaResponse({
          message: "Tasks fetched successfully",
          data: tasks,
        })
      );
    } catch (e) {
      res.status(500).json(
        new SupernovaResponse({
          message: "Something went wrong. Please try again later.",
          error: "Internal Server Error",
        })
      );
      next(e);
    }
  });

  // create task
  router.post(
    "/tasks",
    authenticateJWTMiddleware,
    validateRequestSchema(createTaskRequestSchema),
    async (req, res, next) => {
      try {
        const authCtx = getAuthContext(req);
        const task = await prisma.task.create({
          data: {
            title: req.body.title,
            originalBuildText: req.body.originalBuildText,
            description: req.body.description,
            startAt: req.body.startAt,
            startDate: req.body.startDate,
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
        res.status(500).json(
          new SupernovaResponse({
            message: "Something went wrong. Please try again later.",
            error: "Internal Server Error",
          })
        );
        next(e);
      }
    }
  );

  // update task
  // can also use this for marking task as done
  router.put(
    "/tasks/:id",
    authenticateJWTMiddleware,
    validateRequestSchema(updateTaskRequestSchema),
    async (req, res, next) => {
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
            startDate: req.body.startDate,
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
        res.status(500).json(
          new SupernovaResponse({
            message: "Something went wrong. Please try again later.",
            error: "Internal Server Error",
          })
        );
        next(e);
      }
    }
  );

  // delete task
  router.delete(
    "/tasks/:id",
    authenticateJWTMiddleware,
    validateRequestSchema(deleteTaskRequestSchema),
    async (req, res, next) => {
      try {
        const authCtx = getAuthContext(req);
        const task = await prisma.task.update({
          where: {
            id: req.params.id,
            userId: authCtx.sub,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        return res.status(200).json(
          new SupernovaResponse({
            message: "Task deleted successfully",
            data: task,
          })
        );
      } catch (e) {
        res.status(500).json(
          new SupernovaResponse({
            message: "Something went wrong. Please try again later.",
            error: "Internal Server Error",
          })
        );
        next(e);
      }
    }
  );

  // toggle done status of the task (if it's done, mark it as not done; if it's not done, mark it as done)
  router.put(
    "/tasks/:id/toggle-complete",
    authenticateJWTMiddleware,
    validateRequestSchema(toggleCompleteTaskRequestSchema),
    async (req, res, next) => {
      try {
        const authCtx = getAuthContext(req);
        // find the task
        let task = await prisma.task.findUnique({
          where: {
            id: req.params.id,
            userId: authCtx.sub,
          },
        });
        if (task === null) {
          return res.status(404).json(
            new SupernovaResponse({
              message: "Task not found",
              error: "Not Found",
            })
          );
        }

        task = await prisma.task.update({
          where: {
            id: req.params.id,
            userId: authCtx.sub,
          },
          data: {
            done: !task?.done,
          },
        });
        return res.status(200).json(
          new SupernovaResponse({
            message: "Task updated successfully",
            data: task,
          })
        );
      } catch (e) {
        res.status(500).json(
          new SupernovaResponse({
            message: "Something went wrong. Please try again later.",
            error: "Internal Server Error",
          })
        );
        next(e);
      }
    }
  );

  return router;
}
