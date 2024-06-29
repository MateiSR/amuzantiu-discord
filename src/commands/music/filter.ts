import { ApplicationCommandOptionType, Colors, GuildMember } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "filter",
  description: "sets filter for music",
  options: [
    {
      name: "filter",
      description: "filter to set",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "off",
          value: "off",
        },
        {
          name: "8D",
          value: "8D",
        },
        {
          name: "bassboost",
          value: "bassboost",
        },
        {
          name: "nightcore",
          value: "nightcore",
        },
        {
          name: "trebble",
          value: "trebble",
        },
        {
          name: "soft",
          value: "soft",
        },
        {
          name: "vaporwave",
          value: "vaporwave",
        },
      ],
    },
  ],
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
    if (!dispatcher)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Bot is not connected to a voice channel",
            Colors.Red,
            "Please connect the bot to a voice channel and try again",
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

    // get filter
    const filter = args.getString("filter", true).toLowerCase();

    // if filter == off
    if (filter === "off") {
      dispatcher.player.clearFilters();
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Filters removed",
            Colors.Green,
            "Previously applied filter(s) has been removed",
          ),
        ],
      });
    }

    // set filter shoukaku
    try {
      dispatcher.setFilter(filter);
      await interaction.followUp({
        embeds: [
          client.util.embed(
            "Filter set",
            Colors.Green,
            `Filter set to ${filter}`,
          ),
        ],
      });
    } catch (e) {
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Invalid filter",
            Colors.Red,
            "Please provide a valid filter",
          ),
        ],
      });
    }
  },
});
