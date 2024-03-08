import { Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "now",
  description: "show currently playing song",
  run: async ({ client, interaction, args }) => {
    const dispatcher = await client.manager.get(interaction.guild.id);
    if (!dispatcher || !dispatcher.current)
      return await interaction.followUp({
        embeds: [
          client.util.embed(
            "Nothing is playing",
            Colors.Red,
            "Nothing is playing right now",
          ),
        ],
      });

    const track = dispatcher.current;
    const res = client.manager.get(interaction.guild.id);
    const embed = client.util
      .embed(
        "Now playing",
        Colors.Green,
        `Playing [${track.info.title}](${track.info.uri})`,
      )
      .setThumbnail(
        client.manager.util.getYouTubeThumbnail(track.info.uri, "small"),
      )
      .addFields(
        {
          name: "Duration",
          value: client.util.formatTime(track.info.length),
          inline: true,
        },
        {
          name: "Requested by",
          value: `<@${track.info.author}>`,
          inline: true,
        },
        {
          name: "Progress",
          value:
            "**" +
            client.util.formatTime(dispatcher.player.position) +
            "**" +
            "/" +
            "**" +
            client.util.formatTime(track.info.length) +
            "**",
          inline: true,
        },
      );
    return await interaction.followUp({ embeds: [embed] });
  },
});
