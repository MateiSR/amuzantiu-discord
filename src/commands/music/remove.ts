import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";


export default new Command({
    name: "remove",
    description: "removes a song from the queue",
    options: [{
        name: "position",
        description: "the position of the song you want to remove",
        type: ApplicationCommandOptionType.Integer,
        required: true
    }],
    run: async ({ client, interaction, args }) => {

        const bot = await interaction.guild.members.fetch(client.user.id);
        // check if member is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });
        // check if bot is in the same voice channel as the user
        if (bot.voice.channelId && interaction.member.voice.channelId !== bot.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });
        // check if bot is playing music
        const dispatcher = client.manager.get(interaction.guild.id);
        if (!dispatcher || !dispatcher.current) return await interaction.followUp({ embeds: [client.util.embed("Bot is not playing music", Colors.Red, "Please play a song and try again")] });
        // check if position is valid
        const position = args.getInteger("position");
        if (position < 1 || position > dispatcher.queue.length) return await interaction.followUp({ embeds: [client.util.embed("Invalid position", Colors.Red, "Please enter a valid position and try again")] });

        // remove song from queue
        const removed = dispatcher.queue.splice(position - 1, 1);
        await interaction.followUp({ embeds: [client.util.embed("Song removed", Colors.Green, `Removed [${removed[0].info.title}](${removed[0].info.uri}) from the queue`)] });

}});