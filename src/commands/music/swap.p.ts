import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";


export default new PrefixCommand({
    name: "swap",
    description: "swap two songs position in queue",
    run: async ({ client, message, args }) => {

        // Check if user is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });

        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });

        // Check if user is in the same voice channel as the bot
        if (message.member.voice.channelId !== dispatcher.voiceChannelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        // Check if the queue has more than 2 songs
        if (dispatcher.queue.length < 2) return await message.reply({ embeds: [client.util.embed("Not enough songs in queue", Colors.Red, "Please add more songs to the queue and try again")] });

        // Check if the user provided a valid number
        if (isNaN(Number(args[0])) || isNaN(Number(args[1]))) return await message.reply({ embeds: [client.util.embed("Invalid number", Colors.Red, "Please provide a valid number and try again")] });

        // Swap the songs
        const song1 = dispatcher.queue[Number(args[0]) - 1];
        const song2 = dispatcher.queue[Number(args[1]) - 1];
        dispatcher.queue[Number(args[0]) - 1] = song2;
        dispatcher.queue[Number(args[1]) - 1] = song1;

        await message.reply({ embeds: [client.util.embed("Successfully swapped songs", Colors.Green, `Swapped **${song1.info.title}** with **${song2.info.title}**`)] });
    }});