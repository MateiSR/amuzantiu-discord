import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
    name: "resume",
    description: "Resume paused song",
    aliases: ["unpause"],
    run: async ({ client, message, args }) => {

        // Check if user is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });

        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });

        // Check if user is in the same voice channel as the bot
        if (message.member.voice.channelId !== dispatcher.voiceChannelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        // Check if song is already paused - resume it
        if (dispatcher.player.paused) {
            dispatcher.resume();
            return await message.reply({ embeds: [client.util.embed("Resumed", Colors.Green, `Resumed playing [${dispatcher.current.info.title}](${dispatcher.current.info.uri})`)] });
        }
        else {
            // The player is not paused
            return await message.reply({ embeds: [client.util.embed("Song is not paused", Colors.Red, "Please pause the song first")] });
        }

    }});
