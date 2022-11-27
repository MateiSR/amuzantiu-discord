import { Command } from "../../structures/Command";
import { Guild, Colors, EmbedBuilder, GuildMember, ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    name: "queue",
    description: "Shows the music queue for the current server",
    options: [
        {
            name: "page",
            description: "The page of the queue you want to see",
            type: ApplicationCommandOptionType.Integer,
            required: false,
            minValue: 1
        }
    ],
    async run({ interaction, args, client }) {
        // fetch bot guild member
        const guild = interaction.guild as Guild;
        const bot = await guild.members.fetch(client.user.id);
        // check if member is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && interaction.member.voice.channelId !== bot.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        const dispatcher = await client.manager.get(interaction.guild.id);

        if (!dispatcher) return await interaction.followUp({ embeds: [client.util.embed("No music is playing", Colors.Red, "Please play a song and try again")] });

        if (dispatcher.queue.length === 0) return await interaction.followUp({ embeds: [client.util.embed("No songs in the queue", Colors.Red, "There are no songs left in the queue, add a song and try again")] });

        const queriedPage = args.get("page")?.value as number|| 1;
        const maxPages = Math.ceil(dispatcher.queue.length / 10);
        const selectedPage = (queriedPage > maxPages || queriedPage < 1) ? maxPages : queriedPage;

        try {
            const queue = dispatcher.queue.map((t, i) => {
                const member = interaction.guild.members.cache.get(t.info.author) as GuildMember;
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
            const msg = await interaction.followUp({ embeds: [embeds[selectedPage - 1]] });

        }  catch (error) {
            console.error(error);
            // Send embed response
            return await interaction.followUp({ embeds: [client.util.embed("An error occurred while trying to run the command", Colors.Red, `Please try again later\n\`\`\`${error}\`\`\``)] });
        }

    }});