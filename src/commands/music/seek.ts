import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command} from "../../structures/Command";

export default new Command({
    name: "seek",
    description: "seeks to a specific time in the current song",
    options: [{
        name: "time",
        description: "time to seek to (minutes:seconds)",
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    async run({ client, interaction, args }) {


        // check if user is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in a voice channel
        const dispatcher = await client.manager.get(interaction.guild.id);
        if (!dispatcher || !dispatcher.current) return await interaction.followUp({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });
        // check if user is in the same voice channel as the bot
        if (interaction.member.voice.channelId !== dispatcher.voiceChannelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if song is seekable
        if (!dispatcher.current.info.isSeekable) return await interaction.followUp({ embeds: [client.util.embed("Song is not seekable", Colors.Red, "This song is not seekable")] });

        // get time
        const time = args.getString("time");

        if (time == "0") {
            // restart song
            dispatcher.player.seekTo(0);
            // send success message
            return await interaction.followUp({ embeds: [client.util.embed("Seek", Colors.Green, `Restarted song`)] });
        }

        // check if time is valid
        if (!time.match(/^[0-9]+:[0-9]+$/)) return await interaction.followUp({ embeds: [client.util.embed("Seek failed", Colors.Red, "Invalid time")] });
        // get time in seconds
        const timeMs = client.util.timeToMs(time);

        // check if time is greater than song duration
        if (timeMs > dispatcher.current.info.length) return await interaction.followUp({ embeds: [client.util.embed("Seek failed", Colors.Red, "Time is greater than song duration")] });

        // seek to time
        dispatcher.player.seekTo(timeMs);
        // send success message
        return await interaction.followUp({ embeds: [client.util.embed("Seek", Colors.Green, `Seeked to ${time}`)] });


    }});