import { Track } from "shoukaku";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  Colors,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../structures/Command";

const RESULTS = 10;

export default new Command({
  name: "search",
  description: "Searches for a song and lets you pick from the top results",
  options: [
    {
      name: "query",
      description: "the song you want to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async ({ client, interaction, args }) => {
    const error = (title: string, description: string) =>
      interaction.editReply({
        embeds: [client.util.embed(title, Colors.Red, description)],
        components: [],
      });

    const voiceChannelId = interaction.member.voice.channelId;
    if (!voiceChannelId)
      return error(
        "You are not in a voice channel",
        "Please join a voice channel and try again",
      );
    const bot = await interaction.guild.members.fetch(client.user.id);
    if (bot.voice.channelId && voiceChannelId !== bot.voice.channelId)
      return error(
        "You are not in my voice channel",
        "Please join my voice channel and try again",
      );
    const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
    if (!node)
      return error(
        "Music is unavailable",
        "The music server is down, please try again later",
      );

    const result = await node.rest.resolve(
      `ytsearch:${args.getString("query")}`,
    );
    if (result?.loadType !== "search" || !result.data.length)
      return error(
        "No results found",
        "Please try again with a different query",
      );
    const tracks = (result.data as Track[]).slice(0, RESULTS);

    const menu = new StringSelectMenuBuilder()
      .setCustomId("search")
      .setPlaceholder("Pick a track")
      .addOptions(
        tracks.map((t, i) => ({
          label: t.info.title.slice(0, 100),
          description:
            `${t.info.author} · ${client.util.formatTime(t.info.length)}`.slice(
              0,
              100,
            ),
          value: String(i),
        })),
      );
    const reply = await interaction.editReply({
      embeds: [
        client.util.embed(
          "Search results",
          Colors.Blurple,
          tracks
            .map(
              (t, i) =>
                `**${i + 1}.** [${t.info.title}](${t.info.uri}) \`${client.util.formatTime(t.info.length)}\``,
            )
            .join("\n"),
        ),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
      ],
    });

    const pick = await reply
      .awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id,
        time: 30_000,
      })
      .catch(() => null);
    if (!pick)
      return error("Search timed out", "No track was selected in time");

    const track = tracks[Number(pick.values[0])];
    track.info.author = interaction.user.id;
    const res = await client.manager.handleDispatcher({
      guildId: interaction.guild.id,
      guild: interaction.guild,
      VoiceChannelId: voiceChannelId,
      TextChannelId: interaction.channel.id,
      track,
      member: interaction.member,
    });
    await pick.update({
      embeds: [client.manager.util.trackPlayEmbed(interaction.guild.id, track)],
      components: [],
    });
    res?.play();
  },
});
