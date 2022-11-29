import { Colors } from 'discord.js';
import { PrefixCommand } from '../../structures/PrefixCommand';
import { filters } from '../../structures/music/MusicAssets';

const filterChoices = () => {
    return [...filters.keys()];
}


export default new PrefixCommand({
    name: "filter",
    description: "sets filter for music",
    async run({ client, message, args }) {

        // check if user is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in a voice channel
        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });
        // check if user is in the same voice channel as the bot
        if (message.member.voice.channelId !== dispatcher.voiceChannelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        // get filter
        const filter = args[0];
        // check if filter valid in MusicAssets keys
        if (!filters.get(filter)) return await message.reply({ embeds: [client.util.embed("Invalid filter", Colors.Red, "Please provide a valid filter\n**Valid filters:**\n" + `\`${filterChoices()}\``)] });

        if (!filter) return await message.reply({ embeds: [client.util.embed("No filter provided", Colors.Red, "Please provide a filter to set")] });

        // if filter == off
        if (filter === "off") {
            dispatcher.player.clearFilters();
            return await message.reply({ embeds: [client.util.embed("Filters removed", Colors.Green, "Previously applied filter(s) has been removed")] });
        }

        // set filter shoukaku
        try {
        dispatcher.setFilter(filter);
        await message.reply({ embeds: [client.util.embed("Filter set", Colors.Green, `Filter set to ${filter}`)] });
        } catch (e) {
            return await message.reply({ embeds: [client.util.embed("Invalid filter", Colors.Red, "An error occurred while trying to set the filter")] });
        }

    }});