import { Track } from "shoukaku"
import {
  ActionRowBuilder,
  Colors,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js"
import { PrefixCommand } from "../../structures/PrefixCommand"

const RESULTS = 10

export default new PrefixCommand({
  name: "search",
  description: "Searches for a song and lets you pick from the top results",
  aliases: ["ps", "find"],
  run: async ({ client, message, args }) => {
    const error = (title: string, description: string) =>
      message.reply({
        embeds: [client.util.embed(title, Colors.Red, description)],
      })

    if (!args.length)
      return error("No query provided", "Please provide a query and try again")
    const voiceChannelId = message.member.voice.channelId
    if (!voiceChannelId)
      return error(
        "You are not in a voice channel",
        "Please join a voice channel and try again",
      )
    const bot = await message.guild.members.fetch(client.user.id)
    if (bot.voice.channelId && voiceChannelId !== bot.voice.channelId)
      return error(
        "You are not in my voice channel",
        "Please join my voice channel and try again",
      )
    const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes)
    if (!node)
      return error(
        "Music is unavailable",
        "The music server is down, please try again later",
      )

    const result = await node.rest.resolve(`ytsearch:${args.join(" ")}`)
    if (result?.loadType !== "search" || !result.data.length)
      return error(
        "No results found",
        "Please try again with a different query",
      )
    const tracks = (result.data as Track[]).slice(0, RESULTS)

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
      )
    const reply = await message.reply({
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
    })

    const pick = await reply
      .awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: i => i.user.id === message.author.id,
        time: 30_000,
      })
      .catch(() => null)
    if (!pick)
      return reply.edit({
        embeds: [
          client.util.embed(
            "Search timed out",
            Colors.Red,
            "No track was selected in time",
          ),
        ],
        components: [],
      })

    const track = tracks[Number(pick.values[0])]
    track.info.author = message.author.id
    const res = await client.manager.handleDispatcher({
      guildId: message.guild.id,
      guild: message.guild,
      VoiceChannelId: voiceChannelId,
      TextChannelId: message.channel.id,
      track,
      member: message.member,
    })
    await pick.update({
      embeds: [client.manager.util.trackPlayEmbed(message.guild.id, track)],
      components: [],
    })
    res?.play()
  },
})
