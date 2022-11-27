import { ApplicationCommandOptionType, Colors, Guild } from "discord.js";
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
        // check if bot is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && interaction.member.voice.channelId !== bot.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if query is a url
        const query = args.getString("query");
        const node = client.shoukaku.getNode();

        const dispatcher = await client.manager.get(interaction.guild.id);

        if (isURL(query)) {
            const result = await node.rest.resolve(query);
            if (!result) return await interaction.followUp({ embeds: [client.util.embed("No results found", Colors.Red, "Please try again with a different query")] });
            const track = result.tracks.shift();
            track.info.author = interaction.user.id;
            const isPlaylist = result.loadType === "PLAYLIST_LOADED";

            const res = await client.manager.handleDispatcher({
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
                    await client.manager.handleDispatcher({
                        guildId: interaction.guild.id,
                        guild: interaction.guild,
                        VoiceChannelId: interaction.member.voice.channelId,
                        TextChannelId: interaction.channel.id,
                        track: track,
                        member: interaction.member
                    });

                }
            }

            await interaction.followUp({ embeds: [isPlaylist ? client.util.embed("Playlist added to queue", Colors.Green, `Added ${result.tracks.length + 1} tracks to the queue`) : client.util.embed("Track added to queue", Colors.Green, `Added ${track.info.title} to the queue`)] });

            res?.play();
            return;

        }

    }
});