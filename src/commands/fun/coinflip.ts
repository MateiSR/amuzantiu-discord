import { Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "coinflip",
    description: "flip a coin",
    async run({ interaction, client }) {

        const coin = client.util.randomInt(0, 1) ? "heads" : "tails";
        // Send embed response
        return await interaction.followUp({ embeds: [client.util.embed("Coinflip", Colors.Purple, `The coin landed on **${coin}**`)] });

    }});