import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "volume",
  description: "Sets the music volume",
  options: [
    {
      name: "volume",
      description: "Volume to set",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 0,
      maxValue: 1000,
    },
  ],
  cooldown: 3000,
  run: async ({ client, interaction, args }) => {
    // Get dispatcher
    const dispatcher = await client.manager.get(interaction.guild.id);

    // Check if dispatcher exists
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
    // Check if plaing
    if (dispatcher.player.paused)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Music is paused",
            Colors.Red,
            "Please resume the music and try again",
          ),
        ],
      });

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

    // Get volume
    const volume = args.getInteger("volume", true);
    // Set volume
    dispatcher.player.setGlobalVolume(volume);
    // Send success message
    await interaction.followUp({
      embeds: [
        client.util.embed(
          "Volume set",
          Colors.Green,
          `Set volume to **${volume}%**`,
        ),
      ],
    });
  },
});
