import { PrefixCommand } from "../../structures/PrefixCommand";
import { LavalinkResponse, Playlist, Track } from "shoukaku";
import { Colors, Guild } from "discord.js";

// check if query is a url
const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const trackPlayEmbed = (client, guildId: string, track: Track) => {
  const res = client.manager.get(guildId);
  return client.util
    .embed(
      "Track added to queue",
      Colors.Green,
      `Added [${track.info.title}](${track.info.uri}) to the queue`,
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
        name: "Position in queue",
        value: res?.queue.length.toString(),
        inline: true,
      },
    );
};

export default new PrefixCommand({
  name: "play",
  description: "Fetches and plays queried song",
  aliases: ["p"],
  run: async ({ client, message, args }) => {
    // check if no args provided
    if (!args.length)
      return await message.reply({
        embeds: [
          client.util.embed(
            "No query provided",
            Colors.Red,
            "Please provide a query and try again",
          ),
        ],
      });

    const guild = message.guild as Guild;
    const bot = await guild.members.fetch(client.user.id);
    // check if member is in a voice channel
    if (!message.member.voice.channelId)
      return await message.channel.send({
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
      return await message.channel.send({
        embeds: [
          client.util.embed(
            "You are not in my voice channel",
            Colors.Red,
            "Please join my voice channel and try again",
          ),
        ],
      });
    // check if query is a url
    const query = args[0];
    const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);

    /*
    /* removed due to redundancy
    /* const dispatcher = await client.manager.get(message.guild.id);
    */

    if (isURL(query)) {
      // if query isn't spotify
      if (!client.manager.util.isSpotify(query))
        var result = await node.rest.resolve(query);
      else {
        // for spotify URIs
        client.manager.util.fetchSpotifyTracks(query).then(async (tracks) => {
          // Handle null return
          if (!tracks)
            return await message.reply({
              embeds: [
                client.util.embed(
                  "No tracks found",
                  Colors.Red,
                  "There was an error processing the Spotify link provided",
                ),
              ],
            });
          // handle like isPlaylist or single tracks depending in tracks.size
          const trackObj = tracks.shift();
          const trackStr = trackObj.trackSearch;
          const result = await node.rest.resolve(`ytsearch:${trackStr}`);
          if (
            !result ||
            result.loadType == "error" ||
            result.loadType == "empty"
          )
            return;
          const searchResult = result.data as Track[];
          const track = searchResult.shift();
          track.info.author = message.author.id;
          var res = await client.manager.handleDispatcher({
            guildId: message.guild.id,
            guild: message.guild,
            VoiceChannelId: message.member.voice.channelId,
            TextChannelId: message.channel.id,
            track: track,
            member: message.member,
          });
          const isPlaylist = tracks.length >= 2;
          if (isPlaylist) {
            tracks.forEach(async (trackObj) => {
              const trackStr = trackObj.trackSearch;
              const result = (await node.rest.resolve(
                `ytsearch:${trackStr}`,
              )) as LavalinkResponse | null;
              if (
                !result ||
                result.loadType == "error" ||
                result.loadType == "empty"
              )
                return;
              const searchResult = result.data as Track[];
              const track = searchResult.shift();
              track.info.author = message.author.id;
              res = await client.manager.handleDispatcher({
                guildId: message.guild.id,
                guild: message.guild,
                VoiceChannelId: message.member.voice.channelId,
                TextChannelId: message.channel.id,
                track: track,
                member: message.member,
              });
            });
          }

          res?.play();
          // get dispatcher
          const dispatcher = await client.manager.get(message.guild.id);
          // return error embed
          if (!res && !dispatcher.current)
            return await message.reply({
              embeds: [
                client.util.embed(
                  "An error occured",
                  Colors.Red,
                  "Please try again",
                ),
              ],
            });
          // return success embed
          return await message.reply({
            embeds: [
              isPlaylist
                ? client.util.embed(
                  "Playlist added to queue",
                  Colors.Green,
                  `Added ${tracks.length} tracks to the queue (${message.member})`,
                )
                : trackPlayEmbed(client, message.guild.id, track),
            ],
          });
        });
        return;
      }
    } else var result = await node.rest.resolve(`ytsearch:${args.join(" ")}`);
    if (!result || result.loadType == "empty")
      return await message.reply({
        embeds: [
          client.util.embed(
            "No results found",
            Colors.Red,
            "Please try again with a different query",
          ),
        ],
      });
    if (result.loadType == "error")
      return await message.reply({
        embeds: [
          client.util.embed(
            "Failed to load track",
            Colors.Red,
            "Please try again with a different query",
          ),
        ],
      });
    let track;
    if (result.loadType == "track") track = result.data;
    else if (result.loadType == "search") track = result.data.shift();
    else if (result.loadType == "playlist") track = result.data.tracks.shift();
    track.info.author = message.author.id;
    const isPlaylist = result.loadType === "playlist";

    var res = await client.manager.handleDispatcher({
      guildId: message.guild.id,
      guild: message.guild,
      VoiceChannelId: message.member.voice.channelId,
      TextChannelId: message.channel.id,
      track: track,
      member: message.member,
    });

    let playlistMessage: String;
    if (isPlaylist) {
      const playlist = result.data as Playlist;
      const playlistTracks: Track[] = playlist.tracks;
      for (const track of playlistTracks) {
        track.info.author = message.author.id;
        if (track.info.title.length > 64)
          track.info.title = `${track.info.title
            .split("[")
            .join("[")
            .split("]")
            .join("]")
            .substr(0, 64)}…`;
        res = await client.manager.handleDispatcher({
          guildId: message.guild.id,
          guild: message.guild,
          VoiceChannelId: message.member.voice.channelId,
          TextChannelId: message.channel.id,
          track: track,
          member: message.member,
        });
      }
      playlistMessage = `Added ${playlistTracks.length + 1} tracks to queue`;
    }

    await message.reply({
      embeds: [
        isPlaylist
          ? client.util.embed(
            "Playlist added to queue",
            Colors.Green,
            `${playlistMessage} (${message.member})`,
          )
          : trackPlayEmbed(client, message.guild.id, track),
      ],
    });

    res?.play();
    return;
  },
});
