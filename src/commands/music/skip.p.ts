import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "skip",
  description: "Skip playing song",
  aliases: ["s", "next", "n"],
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

    // If loop mode = track, disable looping & skip the song
    if (dispatcher.loop === "track") {
      dispatcher.loop = "none";
      dispatcher.skip();
      return await message.reply({
        embeds: [
          client.util.embed("Skipped", Colors.Green, "Skipped the song"),
        ],
      });
    }

    // Skip the song
    const amount = parseInt(args[0]) || 1;
    if (amount - 1 > dispatcher.queue.length)
      return await message.reply({
        embeds: [
          client.util.embed(
            "There are not enough songs in queue",
            Colors.Red,
            "Please enter a valid amount",
          ),
        ],
      });
    try {
      dispatcher.skip(amount);
      // Send success message
      return await message.reply({
        embeds: [
          client.util.embed(
            "Skipped",
            Colors.Green,
            `Skipped **${amount}** song${amount > 1 ? "s" : ""}`,
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
            `An error occured while trying to skip the song`,
          ),
        ],
      });
    }
  },
});
