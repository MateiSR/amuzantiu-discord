import {
  ActivityType,
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
} from "discord.js";
import { CommandType } from "../typings/Command";
import { glob } from "glob";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";
import { PrefixCommandType } from "../typings/PrefixCommand";
import { Shoukaku } from "shoukaku";
import ShoukakuHandler from "./music/ShoukakuHandler";
import Logger from "../handlers/logger";
import Util from "./Utilities";
import MusicManager from "./music/MusicManager";
import { version } from "../../package.json";
import CooldownManager from "./CooldownManager";

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  cooldowns: CooldownManager = new CooldownManager();
  prefixCommands: Collection<string, PrefixCommandType> = new Collection();
  shoukaku: Shoukaku;
  logger: Logger;
  environment: string = process.env.environment || "dev";
  manager: MusicManager = new MusicManager();
  util: Util = new Util();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  start() {
    this.loadHandlers();
    this.registerModules();
    this.loadMusicManager();
    this.login(process.env.botToken);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
      this.logger.info(`Registering commands to ${guildId}`);
    } else {
      this.application?.commands.set(commands);
      this.logger.warn("No guildId provided, registering commands globally");
      this.logger.info("Initializing global SLASH commands");
    }
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] =
      new Array<ApplicationCommandDataResolvable>();
    const commandFiles = await glob(`${__dirname}/../commands/*/*{.ts,.js}`);
    const prefixCommandFiles = await glob(
      `${__dirname}/../commands/*/*.p{.ts,.js}`,
    );
    commandFiles.forEach(async (filePath) => {
      if (prefixCommandFiles.includes(filePath)) return;
      const command: CommandType = await this.importFile(filePath);
      if (!command.name) return;
      // Set command category
      command.category = filePath.split("/")[filePath.split("/").length - 2];
      this.logger.log(`Registering SLASH command: ${command.name}`);

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands,
        guildId: process.env.guildId,
      });
    });

    // Prefix commands

    prefixCommandFiles.forEach(async (filePath) => {
      const command: PrefixCommandType = await this.importFile(filePath);
      if (!command.name) return;
      // Set command category
      command.category = filePath.split("/")[filePath.split("/").length - 2];
      this.logger.log(`Registering PREFIX command: ${command.name}`);

      this.prefixCommands.set(command.name, command);
    });

    // Event
    const eventFiles = await glob(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      this.on(event.event, event.run);
    });
  }

  // Set bot activity
  async setActivity() {
    await this.user?.setPresence({
      activities: [
        {
          name: `v${version} | ${process.env.prefix}help`,
          type: ActivityType.Playing,
        },
      ],
      status: "online",
    });
  }

  async loadHandlers() {
    this.logger = new Logger();
    this.logger.info("Initializing handlers");
  }

  async loadMusicManager() {
    this.logger.info("Initializing music manager");
    const shoukaku = new ShoukakuHandler(this);
    this.shoukaku = shoukaku;
  }
}
