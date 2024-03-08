import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "loop",
  description: "set the loop mode",
  run: async ({ client, message, args }) => {
    // check if user is in a voice channel
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
    // check if bot is in a voice channel
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
    // check if user is in the same voice channel as the bot
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

    // get mode
    const mode = args[0];

    // if no mode provided shift loop mode
    if (!mode) {
      dispatcher.loop =
        dispatcher.loop === "none"
          ? "track"
          : dispatcher.loop === "track"
            ? "queue"
            : "none";
      // send embed
      return await message.reply({
        embeds: [
          client.util.embed(
            "Loop mode set",
            Colors.Green,
            `Loop mode set to ${dispatcher.loop}`,
          ),
        ],
      });
    }

    // check if mode is valid
    if (!["none", "track", "queue"].includes(mode))
      return await message.reply({
        embeds: [
          client.util.embed(
            "Invalid mode",
            Colors.Red,
            "Please provide a valid mode `(none, track, queue)`",
          ),
        ],
      });

    // set mode
    dispatcher.loop = mode;

    // send embed
    return await message.reply({
      embeds: [
        client.util.embed(
          "Loop mode set",
          Colors.Green,
          `Loop mode set to ${mode}`,
        ),
      ],
    });
  },
});
