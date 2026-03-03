import { Event } from "../structures/Event"
import { client } from ".."

export default new Event("clientReady", () => {
  client.setActivity()
  client.logger.info("Amuzantiu discord.js client is online")
})
