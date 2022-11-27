import { Colors, CommandInteractionOptionResolver } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("**Command does not exist**");

        try {

            // If command does have a cooldown
            if (command.cooldown) {
                // If user is on cooldown
                const userCooldown = client.cooldowns.checkCooldown(command.name, interaction.user.id);
                if (userCooldown) {
                    const currentTime = Date.now();
                    const expirationTime = userCooldown + command.cooldown;
                    const humanizedCooldown = client.util.formatTime(expirationTime - currentTime, true);
                    if (currentTime < expirationTime) {
                    return interaction.followUp({embeds: [client.util.embed("This command is on cooldown", Colors.Red, `Please wait **${humanizedCooldown}** before using this command again`)]});
                    }
                }
                // If user is not on cooldown
                command.run({
                    args: interaction.options as CommandInteractionOptionResolver,
                    client,
                    interaction: interaction as ExtendedInteraction
                });
                client.cooldowns.handleCooldown(command.name, interaction.user.id, command.cooldown);
                return;
            }
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction
            });
        } catch (error) {
            client.logger.error("An error occured while executing a command", error);
            interaction.followUp("**An error has occured while running this command**");
        }
    }
});
