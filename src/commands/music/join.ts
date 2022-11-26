import { Command } from "../../structures/Command";

// to be rewritten
export default new Command({
    name: "join",
    description: "Joins your current voice channel",
    run: async ({ client, interaction, args }) => {
        const node = client.shoukaku.getNode();
        if (!node) return;

        if (client.shoukaku.players.has(interaction.guild.id)) return await interaction.followUp("I am already in a voice channel");

        await interaction.followUp("Joining your voice channel..");
        const player = await node.joinChannel({
            guildId: interaction.guild.id,
            channelId: interaction.member.voice.channelId,
            shardId: 0 // if unsharded it will always be zero (depending on your library implementation)
        });
        // player is created and ready, do your thing
    }
});
