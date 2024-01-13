import { Guild, Message } from "discord.js";
import { Event } from "../structures/Event";
import { client } from "..";
import { LavalinkResponse } from "shoukaku";

export default new Event("messageCreate", async (message: Message) => {

    const content: string = message.content.toLowerCase().trim();

    for (const customTrack of client.manager.TrackManager.tracks)
        for (const callWord of customTrack.callWords) 
            if (content === callWord) {
                // Fetch bot guild member
                const guild = message.guild as Guild;
                const bot = await guild.members.fetch(client.user.id);
                //  Check for message author voice channel
                if (!message.member.voice.channelId) return;
                // Check for bot voice channel
                if (bot.voice.channelId && message.member.voice.channelId !== bot.voice.channelId) return;
                // Fetch dispatcher
                var dispatcher = await client.manager.get(guild.id);
                // Check if dispatcher exists
                if (dispatcher && dispatcher.current) return;
                // Get node
                const node = client.shoukaku.getNode();
                // Get music track
                const result = await node.rest.resolve(customTrack.url) as LavalinkResponse | null;
                if (!result || result["loadType"] == "NO_MATCHES" || result["loadType"] == "LOAD_FAILED") return;
                const track = result.tracks.shift();
                // Handle dispatcher
                const res = await client.manager.handleDispatcher({
                    guildId: guild.id,
                    guild: guild,
                    VoiceChannelId: message.member.voice.channelId,
                    TextChannelId: message.channel.id,
                    track: track,
                    member: message.member
                });
                // Play music
                res?.play();
                // Re-fetch dispatcher
                dispatcher = await client.manager.get(guild.id);
                // Set loop
                dispatcher.loop = "track";
                // Set nightcore filter
                if (customTrack.filter) dispatcher.setFilter(customTrack.filter);
                // React to message
                if (customTrack.emote) message.react(customTrack.emote);
                return;
            }
});