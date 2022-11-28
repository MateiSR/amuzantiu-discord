import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
    name: "seek",
    description: "seeks to a specific time in the current song",
    async run({ client, message, args }) {


        // check if user is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in a voice channel
        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });
        // check if user is in the same voice channel as the bot
        if (message.member.voice.channelId !== dispatcher.voiceChannelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if song is seekable
        if (!dispatcher.current.info.isSeekable) return await message.reply({ embeds: [client.util.embed("Song is not seekable", Colors.Red, "This song is not seekable")] });

        // get time
        const time = args[0];

        if (time == "0") {
            // restart song
            dispatcher.player.seekTo(0);
            // send success message
            return await message.reply({ embeds: [client.util.embed("Seek", Colors.Green, `Restarted song`)] });
        }

        // check if time is valid
        if (!time.match(/^[0-9]+:[0-9]+$/)) return await message.reply({ embeds: [client.util.embed("Seek failed", Colors.Red, "Invalid time")] });
        // get time in seconds
        const timeMs = client.util.timeToMs(time);

         // check if time is greater than song duration
        if (timeMs > dispatcher.current.info.length) return await message.reply({ embeds: [client.util.embed("Seek failed", Colors.Red, "Time is greater than song duration")] });

        // seek to time
        dispatcher.player.seekTo(timeMs);
        // send success message
        return await message.reply({ embeds: [client.util.embed("Seek", Colors.Green, `Seeked to ${time}`)] });


    }});