import request from "supertest";
import { createApp } from "..";
import { Server } from "http";
import config from "../config";

let httpServer: Server;
let { app } = createApp();

beforeEach(() => {
  // run the server first
  httpServer = app.listen(config.PORT);
});

afterEach((done) => {
  // close the server to stop it from running after the tests
  httpServer.close((err) => {
    if (err) {
      console.error("Error while closing the server:", err);
    } else {
      console.log("Server closed successfully");
    }
    done();
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe("/auth/logout", () => {
  it("should be protected (i.e no cookie with accessToken or authorization header with a good token)", async () => {
    request(app).get("/auth/logout").expect(403);
  });
});
