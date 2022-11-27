import { TextChannel } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";

require("dotenv").config();

export default new Event("messageCreate", async (message) => {

    // If the prefix is not set in the .env file
    if (!process.env.prefix) return console.log("Please set the prefix in the .env file");

    // Check for prefix && message is not from a bot
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    // Separate the prefix from the command
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists
    const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    const slashCommand = client.commands.get(commandName);
    if (!command) {
        if (slashCommand) return message.reply("This command is only available as a **slash command**, please **try again**");
        else return;
    }

    // Manually handle permission checks
    if (command.defaultMemberPermissions) {
        const channel = message.channel as TextChannel;
        if (!channel.permissionsFor(message.member).has(command.defaultMemberPermissions)) return message.reply("You do not have permission to use this command");
        if (!channel.permissionsFor(client.user.id).has(command.defaultMemberPermissions)) return message.reply("The bot does not have permission to use this command");
    }

    // Run command
    try {
        await command.run({ client, message, args });
    } catch (error) { console.error(error) };
});