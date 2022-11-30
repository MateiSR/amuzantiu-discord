import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";


export default new Command({
    name: "help",
    description: "Help menu",
    options: [
        {
            name: "command",
            description: "The command you want help with",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async ({ client, interaction, args }) => {
        const command = args.getString("command");
        if (command) {
        const cmd = client.commands.get(command);
        // If the command doesn't exist, return embed error
        if (!cmd) return interaction.followUp({ embeds: [client.util.embed("Invalid Command", Colors.Red, `Command \`${command}\` doesn't exist\nPlease try using the \`help\` command to show a list of all commands`)] });
        else return interaction.followUp({ embeds: [client.util.embed("Help", Colors.Blue, `**Name:** ${cmd.name}\n**Description:** ${cmd.description}\n**Category:** ${cmd.category}\n**Cooldown:** ` + (cmd.cooldown ? `${client.util.formatTime(cmd.cooldown, true)}` : "None"))] });
        }
        const categories = [...new Set(client.commands.map((cmd) => cmd.category))];
        // reply embed with all categories & commands
        return interaction.followUp({ embeds: [client.util.embed("Help", Colors.Blue, categories.map((category) => `**${category}**\n${client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ")}`).join("\n\n"))] });
    }

});