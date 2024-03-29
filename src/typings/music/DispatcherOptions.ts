import { Guild } from "discord.js";
import { Player } from "shoukaku";
import { ExtendedClient } from "../../structures/Client";

export type DispatcherOptions = {
  client?: ExtendedClient;
  guildId: string;
  guild?: Guild;
  textChannelId?: string;
  voiceChannelId?: string;
  player: Player;
};
