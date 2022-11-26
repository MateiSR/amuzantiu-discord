import { Event } from "../structures/Event";
import { client } from "..";

export default new Event("ready", () => {
    client.logger.info("Bot is online");
});
