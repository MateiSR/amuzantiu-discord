import { ApplicationCommandOptionType, Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "remove",
  description: "removes a song from the queue",
  aliases: ["rm"],
  run: async ({ client, message, args }) => {
    const bot = await message.guild.members.fetch(client.user.id);
    // check if member is in a voice channel
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
    // check if bot is in the same voice channel as the user
    if (
      bot.voice.channelId &&
      message.member.voice.channelId !== bot.voice.channelId
    )
      return await message.reply({
        embeds: [
          client.util.embed(
            "You are not in my voice channel",
            Colors.Red,
            "Please join my voice channel and try again",
          ),
        ],
      });
    // check if bot is playing music
    const dispatcher = client.manager.get(message.guild.id);
    if (!dispatcher || !dispatcher.current)
      return await message.reply({
        embeds: [
          client.util.embed(
            "Bot is not playing music",
            Colors.Red,
            "Please play a song and try again",
          ),
        ],
      });
    // check if position is valid
    const position = parseInt(args[0]) || 0;
    if (position < 1 || position > dispatcher.queue.length)
      return await message.reply({
        embeds: [
          client.util.embed(
            "Invalid position",
            Colors.Red,
            "Please enter a valid position and try again",
          ),
        ],
      });

    // remove song from queue
    const removed = dispatcher.queue.splice(position - 1, 1);
    await message.reply({
      embeds: [
        client.util.embed(
          "Song removed",
          Colors.Green,
          `Removed [${removed[0].info.title}](${removed[0].info.uri}) from the queue`,
        ),
      ],
    });
  },
});
