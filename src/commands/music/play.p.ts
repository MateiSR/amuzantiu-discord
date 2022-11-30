import { PrefixCommand } from "../../structures/PrefixCommand";
import { LavalinkResponse, Track } from "shoukaku";
import { Colors, Guild } from 'discord.js';
import { Youtube } from "../../handlers/youtube";

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
            .setThumbnail(Youtube.thumb(track.info.uri, "small"))
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

export default new PrefixCommand({
    name: "play",
    description: "Fetches and plays queried song",
    aliases: ["p"],
    run: async ({ client, message, args }) => {

        // check if no args provided
        if (!args.length) return await message.reply({ embeds: [client.util.embed("No query provided", Colors.Red, "Please provide a query and try again")] });

        const guild = message.guild as Guild;
        const bot = await guild.members.fetch(client.user.id);
        // check if member is in a voice channel
        if (!message.member.voice.channelId) return await message.channel.send({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && message.member.voice.channelId !== bot.voice.channelId) return await message.channel.send({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if query is a url
        const query = args[0];
        const node = client.shoukaku.getNode();

        /*
        /* removed due to redundancy
        /* const dispatcher = await client.manager.get(message.guild.id);
        */

        if (isURL(query)) var result = await node.rest.resolve(query) as LavalinkResponse | null;
        else var result = await node.rest.resolve(`ytsearch:${query}`) as LavalinkResponse | null;
        if (!result || result["loadType"] == "NO_MATCHES") return await message.reply({ embeds: [client.util.embed("No results found", Colors.Red, "Please try again with a different query")] });
        if (result["loadType"] == "LOAD_FAILED") return await message.reply({ embeds: [client.util.embed("Failed to load track", Colors.Red, "Please try again with a different query")] });
        const track = result.tracks.shift();
        track.info.author = message.author.id;
        const isPlaylist = result.loadType === "PLAYLIST_LOADED";

        var res = await client.manager.handleDispatcher({
            guildId: message.guild.id,
            guild: message.guild,
            VoiceChannelId: message.member.voice.channelId,
            TextChannelId: message.channel.id,
            track: track,
            member: message.member
        });

        if (isPlaylist) {
            for (const track of result.tracks) {
                track.info.author = message.author.id;
                if (track.info.title.length > 64) track.info.title = `${track.info.title.split('[').join('[').split(']').join(']').substr(0, 64)}…`;
                res = await client.manager.handleDispatcher({
                    guildId: message.guild.id,
                    guild: message.guild,
                    VoiceChannelId: message.member.voice.channelId,
                    TextChannelId: message.channel.id,
                    track: track,
                    member: message.member
                });
            }
        }

        await message.reply({ embeds: [isPlaylist ? client.util.embed("Playlist added to queue", Colors.Green, `Added ${result.tracks.length + 1} tracks to the queue (${message.member})`) : trackPlayEmbed(client, message.guild.id, track)] });

        res?.play();
        return;

    }});
