import { Colors } from "discord.js";
import { PrefixCommand } from '../../structures/PrefixCommand';


export default new PrefixCommand({
    name: "previous",
    description: "Play previous song",
    run: async ({ client, message, args }) => {

        const dispatcher = await client.manager.get(message.guild.id);
        // Check if dispatcher exists
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });
        // Check if there is a previous song
        if (!dispatcher.previous) return await message.reply({ embeds: [client.util.embed("No previous song", Colors.Red, "There is no previous song to play")] });
        // Check if user is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // Check if user is in the same voice channel as the bot
        if (message.member.voice.channelId !== dispatcher.voiceChannelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // Send success message
        await message.reply({ embeds: [client.util.embed("Playing previous song", Colors.Green, `Playing **[${dispatcher.previous.info.title}](${dispatcher.previous.info.uri})**`)] });
        // Play previous song
        dispatcher.playPrevious();
        return;

}});