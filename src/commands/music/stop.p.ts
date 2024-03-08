import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "stop",
  description: "stop playing song & clear queue",
  aliases: ["leave", "disconnect", "clear", "dc"],
  run: async ({ client, message, args }) => {
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

    const dispatcher = await client.manager.get(message.guild.id);
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

    // Stop the player
    try {
      dispatcher.stop();
      return await message.reply({
        embeds: [
          client.util.embed(
            "Stopped - Leaving..",
            Colors.Green,
            `Leaving voice channel`,
          ),
        ],
      });
    } catch (error) {
      // Inform user of occured error
      return await message.reply({
        embeds: [
          client.util.embed(
            "Error",
            Colors.Red,
            `An error occured while trying to stop the player`,
          ),
        ],
      });
    }
  },
});
