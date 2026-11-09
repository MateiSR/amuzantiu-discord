require("dotenv").config({ quiet: true });
import { ExtendedClient } from "./structures/Client";

export const client = new ExtendedClient();

process.on("unhandledRejection", (error) =>
  client.logger.error("Unhandled promise rejection", error),
);

client.start();
