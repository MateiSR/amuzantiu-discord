import { TextChannel } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { Colors } from 'discord.js';

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
        if (!channel.permissionsFor(message.member).has(command.defaultMemberPermissions)) return message.reply("You do not have enough permissions to use this command.");
        if (!channel.permissionsFor(client.user.id).has(command.defaultMemberPermissions)) return message.reply("The bot does not have enough permissions to use this command.");
    }

    // Run command
    try {
        // Check command cooldown
        if (command.cooldown) {
            const userCooldown = client.cooldowns.checkCooldown(command.name, message.author.id);
            if (userCooldown) {
                const currentTime = Date.now();
                const expirationTime = userCooldown + command.cooldown;
                const humanizedCooldown = client.util.formatTime(expirationTime - currentTime, true);
                if (currentTime < expirationTime) {
                    return message.reply({embeds: [client.util.embed("This command is on cooldown", Colors.Red, `Please wait **${humanizedCooldown}** before using this command again`)]});
                }
            }

            // Check if command category is music
            if (command.category === "music") {
            // get dispatcher
            const dispatcher = await client.manager.get(message.guild.id);
            if (dispatcher) {
            // Switch text channel
            dispatcher.switchTextChannel(message.channelId);
            }
            }

            await command.run({ client, message, args });
            client.cooldowns.handleCooldown(command.name, message.author.id, command.cooldown);
            return;
        }

        // Check if command category is music
        if (command.category === "music") {
        // get dispatcher
        const dispatcher = await client.manager.get(message.guild.id);
        if (dispatcher) {
        // Switch text channel
        dispatcher.switchTextChannel(message.channelId);
        }
        }

        await command.run({ client, message, args });
    } catch (error) { console.error(error) };
});