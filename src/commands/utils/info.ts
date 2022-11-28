import { Colors } from "discord.js";
import { Command} from "../../structures/Command";
import { version } from "../../../package.json";

export default new Command({
    name: "info",
    description: "get info about the bot",
    async run({ client, interaction, args }) {

        const uptime = client.uptime / 1000;
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);
        const uptimeMessage = `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`;

        // send embed reply
        try {
        const embed = client.util.embed("Info", Colors.Aqua, "Here's some info about me!")
            .addFields(

                { name : "Username", value: client.user.tag, inline: true },
                { name : "Prefix", value: "`" + process.env.prefix + "`", inline: true },
                { name : "Version", value: version, inline: true},
                { name: "Uptime", value: uptimeMessage, inline: true },
                { name: "Guilds", value: client.guilds.cache.size.toString(), inline: true },
                { name: "Users", value: client.users.cache.size.toString(), inline: true },
                { name: "Channels", value: client.channels.cache.size.toString(), inline: true },
                { name: "Commands", value: `${client.commands.size} slash, ${client.prefixCommands.size} prefix`, inline: true },
                { name: "Memory Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "Invite", value: `[Click Here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`, inline: true },
            )
            // set avatar
            .setThumbnail(client.user.displayAvatarURL())

        await interaction.followUp({ embeds: [embed] });
            } catch (error) {
                console.error(error);
            }

    }});