import { Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
	name: "stop",
	description: "stop playing song & clear queue",
	run: async ({ client, interaction, args }) => {
		// Check if user is in a voice channel
		if (!interaction.member.voice.channelId)
			return await interaction.followUp({
				embeds: [
					client.util.embed(
						"You are not in a voice channel",
						Colors.Red,
						"Please join a voice channel and try again",
					),
				],
			});

		const dispatcher = await client.manager.get(interaction.guild.id);
		if (!dispatcher)
			return await interaction.followUp({
				embeds: [
					client.util.embed(
						"Bot is not connected to a voice channel",
						Colors.Red,
						"Please connect the bot to a voice channel and try again",
					),
				],
			});

		// Check if user is in the same voice channel as the bot
		if (interaction.member.voice.channelId !== dispatcher.voiceChannelId)
			return await interaction.followUp({
				embeds: [
					client.util.embed(
						"You are not in my voice channel",
						Colors.Red,
						"Please join my voice channel and try again",
					),
				],
			});

		// Stop the player
		try {
			dispatcher.stop();
			return await interaction.followUp({
				embeds: [
					client.util.embed(
						"Stopped - Leaving..",
						Colors.Green,
						`Leaving voice channel`,
					),
				],
			});
		} catch (error) {
			// Inform user of occured error
			return await interaction.followUp({
				embeds: [
					client.util.embed(
						"Error",
						Colors.Red,
						`An error occured while trying to stop the player`,
					),
				],
			});
		}
	},
});
