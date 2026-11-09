import { Shoukaku, Connectors } from "shoukaku"

const options = {
  moveOnDisconnect: false,
  resume: false,
  resumeTimeout: 180,
  reconnectTries: 2,
  restTimeout: 240000,
}

const RECONNECT_DELAY = 30_000

const nodes = [
  {
    name: "Music Node 1",
    url: process.env.LavalinkURL,
    auth: process.env.LavalinkPassword,
  },
]

export default class ShoukakuHandler extends Shoukaku {
  constructor(client) {
    super(new Connectors.DiscordJS(client), nodes, options)

    this.on("ready", (name, reconnected) => {
      client.logger.info(
        `Shoukaku Node ${name} `,
        reconnected ? "reconnected" : "connected",
      )
    })

    this.on("error", (name, error) => {
      client.logger.error(
        `Shoukaku Node ${name} had an error: ${error.message}`,
      )
    })

    this.on("close", (name, code, reason) => {
      client.logger.warn(
        `Shoukaku Node ${name} closed with code ${code} and reason ${reason}`,
      )
    })

    // Shoukaku drops a node for good once reconnectTries run out; re-add it so
    // the bot recovers when Lavalink comes back instead of needing a restart.
    this.on("disconnect", (name) => {
      client.logger.warn(
        `Shoukaku Node ${name} disconnected; retrying in ${RECONNECT_DELAY / 1000}s`,
      )
      // Players died with the node; drop stale dispatchers so new plays start fresh
      for (const guildId of client.manager.keys()) {
        this.leaveVoiceChannel(guildId)
        client.manager.delete(guildId)
      }
      setTimeout(() => {
        if (!this.nodes.has(name))
          this.addNode(nodes.find((node) => node.name === name))
      }, RECONNECT_DELAY)
    })

    this.on("debug", (name, reason) => {
      if (client.environment == "debug")
        client.logger.debug(`Shoukaku Node ${name} debug: ${reason}`)
    })
  }
}
