import { Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "resume",
  description: "Resume paused song",
  run: async ({ client, interaction, args }) => {
    // Check if user is in a voice channel
    if (!interaction.member.voice.channelId)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "You are not in a voice channel",
            Colors.Red,
            "Please join a voice channel and try again",
          ),
        ],
      });

    const dispatcher = await client.manager.get(interaction.guild.id);
    if (!dispatcher || !dispatcher.current)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "No song is playing",
            Colors.Red,
            "Please play a song first",
          ),
        ],
      });

    // Check if user is in the same voice channel as the bot
    if (interaction.member.voice.channelId !== dispatcher.voiceChannelId)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "You are not in my voice channel",
            Colors.Red,
            "Please join my voice channel and try again",
          ),
        ],
      });

    // Check if song is already paused - resume it
    if (dispatcher.player.paused) {
      dispatcher.resume();
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Resumed",
            Colors.Green,
            `Resumed playing [${dispatcher.current.info.title}](${dispatcher.current.info.uri})`,
          ),
        ],
      });
    } else {
      // The player is not paused
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Song is not paused",
            Colors.Red,
            "Please pause the song first",
          ),
        ],
      });
    }
  },
});
