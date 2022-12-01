import { Colors } from "discord.js";
import { Command } from "../../structures/Command";


export default new Command({
    name: "lyrics",
    description: "lyrics of the currently playing song",
    run: async ({ client, interaction, args }) => {
        // check if there is a song playing
        const dispatcher = await client.manager.get(interaction.guild.id);
        if (!dispatcher || !dispatcher.current) return await interaction.followUp({ embeds: [client.util.embed("Nothing is playing", Colors.Red, "Nothing is playing right now")] });

        // get the lyrics
        const lyrics = await client.manager.util.fetchLyrics(dispatcher.current.info.title);

        // if there are no lyrics
        if (!lyrics) return await interaction.followUp({ embeds: [client.util.embed("No lyrics found", Colors.Red, "No lyrics found for this song")] });

        // send the lyrics
        await interaction.followUp({ embeds: [client.util.embed("Lyrics", Colors.Purple, lyrics)] });

}});