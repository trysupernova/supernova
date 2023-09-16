import config from "./config";
import pino from "pino";

// only enable logging to axiom in production
export let loggerOptions: any = {};
if (process.env.NODE_ENV === "production") {
  loggerOptions = {
    transport: {
      target: "@axiomhq/pino",
      options: {
        dataset: config.AXIOM_DATASET,
        token: config.AXIOM_TOKEN,
      },
    },
  };
}

let logger: pino.Logger;
if (process.env.NODE_ENV === "production") {
  logger = pino({ level: "info" }, pino.transport(loggerOptions.transport)); // send to axiom on production
} else {
  logger = pino({ level: "info" }); // stdout
}
