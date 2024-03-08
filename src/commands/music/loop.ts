import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "loop",
  description: "set the loop mode",
  options: [
    {
      name: "mode",
      description: "the loop mode",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "none",
          value: "none",
        },
        {
          name: "track",
          value: "track",
        },
        {
          name: "queue",
          value: "queue",
        },
      ],
    },
  ],
  run: async ({ client, interaction, args }) => {
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

    // get mode
    const mode = args.getString("mode", true);

    // set mode
    dispatcher.loop = mode;

    // send embed
    return await interaction.followUp({
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
