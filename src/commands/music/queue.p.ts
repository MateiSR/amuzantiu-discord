import { Guild, Colors, EmbedBuilder, GuildMember, ApplicationCommandOptionType } from 'discord.js';
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
    name: "queue",
    description: "Shows the music queue for the current server",
    aliases: ["q"],
    async run({ message, args, client }) {
        // fetch bot guild member
        const guild = message.guild as Guild;
        const bot = await guild.members.fetch(client.user.id);
        // check if member is in a voice channel
        if (!message.member.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && message.member.voice.channelId !== bot.voice.channelId) return await message.reply({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        const dispatcher = await client.manager.get(message.guild.id);

        if (!dispatcher) return await message.reply({ embeds: [client.util.embed("No music is playing", Colors.Red, "Please play a song and try again")] });

        if (dispatcher.queue.length === 0) return await message.reply({ embeds: [client.util.embed("No songs in the queue", Colors.Red, "There are no songs left in the queue, add a song and try again")] });

        const queriedPage = parseInt(args[0])|| 1;
        const maxPages = Math.ceil(dispatcher.queue.length / 10);
        const selectedPage = (queriedPage > maxPages || queriedPage < 1) ? maxPages : queriedPage;

        try {
            const queue = dispatcher.queue.map((t, i) => {
                const member = message.guild.members.cache.get(t.info.author) as GuildMember;
                return `\`${++i}.\`[${t.info.title}](${t.info.uri}) ${t.info.isStream ? '**Stream' : `- **${client.util.formatTime(t.info.length)}** [${member}]`} `});
            const chunked = client.util.chunk(queue, 10);
            const embeds = new Array<EmbedBuilder>();

            var page = 0;
            for (const chunk of chunked) {
                page++;
                const embed = client.util.embed(`Music Queue - ${guild.name}`, Colors.Purple, `${chunk.join('\n')}`).setFooter({"text": `Page ${page}/${chunked.length}`});
                embeds.push(embed);
            }

            // send message for selected page
            const msg = await message.reply({ embeds: [embeds[selectedPage - 1]] });

        }  catch (error) {
            console.error(error);
            // Send embed response
            return await message.reply({ embeds: [client.util.embed("An error occurred while trying to run the command", Colors.Red, `Please try again later\n\`\`\`${error}\`\`\``)] });
        }

    }});