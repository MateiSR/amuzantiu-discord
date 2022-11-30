import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";


export default new PrefixCommand({
    name: "help",
    description: "Help menu",
    run: async ({ client, message, args }) => {
        const command = args[0];
        if (command) {
        const cmd = client.prefixCommands.get(command);
        // If the command doesn't exist, return embed error
        if (!cmd) return message.reply({ embeds: [client.util.embed("Invalid Command", Colors.Red, `Command \`${command}\` doesn't exist\nPlease try using the \`help\` command to show a list of all commands`)] });
        else return message.reply({ embeds: [client.util.embed("Help", Colors.Blue, `**Name:** ${cmd.name}\n**Description:** ${cmd.description}\n**Category:** ${cmd.category}\n**Cooldown:** ` + (cmd.cooldown ? `${client.util.formatTime(cmd.cooldown, true)}` : "None"))] });
        }
        const categories = [...new Set(client.prefixCommands.map((cmd) => cmd.category))];
        // reply embed with all categories & commands
        return message.reply({ embeds: [client.util.embed("Help", Colors.Blue, categories.map((category) => `**${category}**\n${client.prefixCommands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ")}`).join("\n\n"))] });
    }

});