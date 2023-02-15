import { ApplicationCommandOptionType, Colors, Guild } from "discord.js";
import { LavalinkResponse, Track } from "shoukaku";
import { Command } from "../../structures/Command";

// check if query is a url
const isURL = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

const trackPlayEmbed = (client, guildId: string,  track: Track) => {
    const res = client.manager.get(guildId);
    return client.util.embed("Track added to queue", Colors.Green, `Added [${track.info.title}](${track.info.uri}) to the queue`)
            .setThumbnail(client.manager.util.getYouTubeThumbnail(track.info.uri, "small"))
            .addFields({
                name: "Duration",
                value: client.util.formatTime(track.info.length),
                inline: true
            },
                {
                    name: "Requested by",
                    value: `<@${track.info.author}>`,
                    inline: true
                },
                {
                    name: "Position in queue",
                    value: res?.queue.length.toString(),
                    inline: true
                })
}



export default new Command({
    name: "play",
    description: "Fetches and plays queried song",
    options: [{
        name: "query",
        description: "the song you want to play",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: async ({ client, interaction, args }) => {
        // fetch bot guild member
        const guild = interaction.guild as Guild;
        const bot = await guild.members.fetch(client.user.id);
        // check if member is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && interaction.member.voice.channelId !== bot.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if query is a url
        const query = args.getString("query");
        const node = client.shoukaku.getNode();

        /*
        /* removed due to redundancy
        /* const dispatcher = await client.manager.get(interaction.guild.id);
        */

        // check if query is a url
        if (isURL(query))
        {
            // if query isn't spotify
            if (!client.manager.util.isSpotify(query)) var result = await node.rest.resolve(query) as LavalinkResponse | null;
            else {
                client.manager.util.fetchSpotifyTracks(query).then(async tracks => {
                    // Handle null return
                    if (!tracks) return await interaction.followUp({ embeds: [client.util.embed("No tracks found", Colors.Red, "There was an error processing the Spotify link provided")] });
                    // handle like isPlaylist or single tracks depending in tracks.size
                    const trackObj = tracks.shift();
                    const trackStr = trackObj.trackSearch;
                    const result = await node.rest.resolve(`ytsearch:${trackStr}`) as LavalinkResponse | null;
                    if (!result || result["loadType"] == "NO_MATCHES" || result["loadType"] == "LOAD_FAILED") return;
                    const track = result.tracks.shift();
                    track.info.author = interaction.user.id;
                    var res = await client.manager.handleDispatcher({
                        guildId: interaction.guild.id,
                        guild: interaction.guild,
                        VoiceChannelId: interaction.member.voice.channelId,
                        TextChannelId: interaction.channel.id,
                        track: track,
                        member: interaction.member
                    });
                    const isPlaylist = tracks.length >= 2;
                    if (isPlaylist) {
                    tracks.forEach(async trackObj => {
                        const trackStr = trackObj.trackSearch;
                        client.logger.debug(`Handling spotify track: ${trackStr}`);
                        const result = await node.rest.resolve(`ytsearch:${trackStr}`) as LavalinkResponse | null;
                        if (!result || result["loadType"] == "NO_MATCHES" || result["loadType"] == "LOAD_FAILED") return;
                        const track = result.tracks.shift();
                        track.info.author = interaction.user.id;
                        res = await client.manager.handleDispatcher({
                            guildId: interaction.guild.id,
                            guild: interaction.guild,
                            VoiceChannelId: interaction.member.voice.channelId,
                            TextChannelId: interaction.channel.id,
                            track: track,
                            member: interaction.member
                        });
                    });
                    }

                    res?.play();
                    // return error embed
                    if (!res) return await interaction.followUp({ embeds: [client.util.embed("An error occured", Colors.Red, "Please try again")] });
                    // return success embed
                    return await interaction.followUp({ embeds: [isPlaylist ? client.util.embed("Playlist added to queue", Colors.Green, `Added ${tracks.length} tracks to the queue (${interaction.member})`) : trackPlayEmbed(client, interaction.guild.id, track)] });
                });
                return;
            }
        }
        else var result = await node.rest.resolve(`ytsearch:${query}`) as LavalinkResponse | null;
        if (!result || result["loadType"] == "NO_MATCHES") return await interaction.followUp({ embeds: [client.util.embed("No results found", Colors.Red, "Please try again with a different query")] });
        if (result["loadType"] == "LOAD_FAILED") return await interaction.followUp({ embeds: [client.util.embed("Failed to load track", Colors.Red, "Please try again with a different query")] });
        const track = result.tracks.shift();
        track.info.author = interaction.user.id;
        const isPlaylist = result.loadType === "PLAYLIST_LOADED";

        var res = await client.manager.handleDispatcher({
            guildId: interaction.guild.id,
            guild: interaction.guild,
            VoiceChannelId: interaction.member.voice.channelId,
            TextChannelId: interaction.channel.id,
            track: track,
            member: interaction.member
        });

        if (isPlaylist) {
            for (const track of result.tracks) {
                track.info.author = interaction.user.id;
                if (track.info.title.length > 64) track.info.title = `${track.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}…`;
                res = await client.manager.handleDispatcher({
                    guildId: interaction.guild.id,
                    guild: interaction.guild,
                    VoiceChannelId: interaction.member.voice.channelId,
                    TextChannelId: interaction.channel.id,
                    track: track,
                    member: interaction.member
                });
            }
        }

        await interaction.followUp({ embeds: [isPlaylist ? client.util.embed("Playlist added to queue", Colors.Green, `Added ${result.tracks.length + 1} tracks to the queue (${interaction.member})`) : trackPlayEmbed(client, interaction.guild.id, track)] });

        res?.play();
        return;


    }
});
