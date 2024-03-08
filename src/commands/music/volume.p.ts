import { ApplicationCommandOptionType, Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "volume",
  description: "Sets the music volume",
  cooldown: 3000,
  run: async ({ client, message, args }) => {
    // Get dispatcher
    const dispatcher = await client.manager.get(message.guild.id);

    // Check if dispatcher exists
    if (!dispatcher || !dispatcher.current)
      return await message.reply({
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
      return await message.reply({
        embeds: [
          client.util.embed(
            "Music is paused",
            Colors.Red,
            "Please resume the music and try again",
          ),
        ],
      });

    // Check if user is in a voice channel
    if (!message.member.voice.channelId)
      return await message.reply({
        embeds: [
          client.util.embed(
            "You are not in a voice channel",
            Colors.Red,
            "Please join a voice channel and try again",
          ),
        ],
      });
    // Check if user is in the same voice channel as the bot
    if (message.member.voice.channelId !== dispatcher.voiceChannelId)
      return await message.reply({
        embeds: [
          client.util.embed(
            "You are not in my voice channel",
            Colors.Red,
            "Please join my voice channel and try again",
          ),
        ],
      });

    // Check if valid volume
    if (!args[0] || parseInt(args[0]) < 0 || parseInt(args[0]) > 1000)
      return await message.reply({
        embeds: [
          client.util.embed(
            "Invalid volume",
            Colors.Red,
            "Please enter a valid volume **between 1-1000**",
          ),
        ],
      });
    // Get volume
    const volume = parseInt(args[0]) || 100;
    // Set volume
    dispatcher.player.setGlobalVolume(volume);
    // Send success message
    await message.reply({
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
