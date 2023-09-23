import express from "express";

export default function buildStatsRouter() {
  const router = express.Router();

  router.get("/", async (_, res) => {
    return res.send({
      up: true,
    });
  });
  return router;
}
