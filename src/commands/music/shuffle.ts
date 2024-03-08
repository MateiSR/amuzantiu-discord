import { Command } from "../../structures/Command";
import { Colors } from "discord.js";

export default new Command({
  name: "shuffle",
  description: "shuffles the music queue",
  async run({ client, interaction, args }) {
    // check if user is in a voice channel
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
    // check if bot is in a voice channel
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
    // check if user is in the same voice channel as the bot
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

    // shuffle the queue
    dispatcher.shuffle();
    // send success message
    return await interaction.followUp({
      embeds: [
        client.util.embed("Shuffled", Colors.Green, `Shuffled the queue`),
      ],
    });
  },
});
