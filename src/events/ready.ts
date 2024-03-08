import { Event } from "../structures/Event";
import { client } from "..";

export default new Event("ready", () => {
  client.setActivity();
  client.logger.info("Amuzantiu discord.js client is online");
});
