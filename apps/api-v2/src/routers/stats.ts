import { Router } from "express";

export default function buildStatsRouter(): Router {
  const router = Router();

  router.get("/", async (_, res) => {
    return res.send({
      up: true,
    });
  });
  return router;
}
