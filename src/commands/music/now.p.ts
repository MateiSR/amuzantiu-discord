import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";


export default new PrefixCommand({
    name: "now",
    description: "show currently playing song",
    aliases: ["playing", "current", "np"],
    run: async ({ client, message, args }) => {

        const dispatcher = await client.manager.get(message.guild.id);
        if (!dispatcher || !dispatcher.current) return await message.reply({ embeds: [client.util.embed("Nothing is playing", Colors.Red, "Nothing is playing right now")] });

        const track = dispatcher.current;
        const res = client.manager.get(message.guild.id);
        const embed = client.util.embed("Now playing", Colors.Green, `Playing [${track.info.title}](${track.info.uri})`)
            .setThumbnail(client.manager.util.getYouTubeThumbnail(track.info.uri, "small"))
            .addFields({
                name: "Duration",
                value: client.util.formatTime(track.info.length),
                inline: true
            },
                {
                    name: "Requested by",
                    value: `<@${track.info.author}>`,
                    inline: true
                },
                {
                    name: "Remaining",
                    value: client.util.formatTime(track.info.length - dispatcher.player.position),
                    inline: true
                })
        return await message.reply({ embeds: [embed] });
    }
});