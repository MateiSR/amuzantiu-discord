import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "skip",
    description: "Skip playing song",
    options: [
        {
            name: "amount",
            description: "Amount of songs to skip",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    run: async ({ client, interaction, args }) => {

        // Check if user is in a voice channel
        if (!interaction.member.voice.channelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in a voice channel", Colors.Red, "Please join a voice channel and try again")] });

        const dispatcher = await client.manager.get(interaction.guild.id);
        if (!dispatcher || !dispatcher.current) return await interaction.followUp({ embeds: [client.util.embed("No song is playing", Colors.Red, "Please play a song first")] });

        // Check if user is in the same voice channel as the bot
        if (interaction.member.voice.channelId !== dispatcher.voiceChannelId) return await interaction.followUp({ embeds: [client.util.embed("You are not in my voice channel", Colors.Red, "Please join my voice channel and try again")] });

        // Skip the song
        const amount = args.getInteger("amount") || 1;
        if (amount - 1 > dispatcher.queue.length) return await interaction.followUp({ embeds: [client.util.embed("There are not enough songs in queue", Colors.Red, "Please enter a valid amount")] });
        try {
        dispatcher.skip(amount);
        // Send success message
        return await interaction.followUp({ embeds: [client.util.embed("Skipped", Colors.Green, `Skipped **${amount}** song${amount > 1 ? "s" : ""}`)] });
        } catch (error) {
            // Inform user of occured error
            return await interaction.followUp({ embeds: [client.util.embed("Error", Colors.Red, `An error occured while trying to skip the song`)] });
        }


    }});
