import { CommandInteractionOptionResolver } from "discord.js";
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
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction
            });
        } catch (error) {
            interaction.followUp("**An error has occured while running this command");
        }
    }
});
