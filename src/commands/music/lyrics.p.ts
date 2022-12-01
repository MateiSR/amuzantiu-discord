import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";


export default new PrefixCommand({
    name: "lyrics",
    description: "lyrics of the currently playing song",
    run: async ({ client, message, args }) => {
        // check if there is a song playing
        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("Nothing is playing", Colors.Red, "Nothing is playing right now")] });

        // get the lyrics
        const lyrics = await client.manager.util.fetchLyrics(dispatcher.current.info.title);

        // if there are no lyrics
        if (!lyrics) return await message.reply({ embeds: [client.util.embed("No lyrics found", Colors.Red, "No lyrics found for this song")] });

        // send the lyrics
        await message.reply({ embeds: [client.util.embed("Lyrics", Colors.Purple, lyrics)] });

}});