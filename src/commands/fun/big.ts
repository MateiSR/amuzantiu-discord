import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, Colors } from "discord.js";

export default new Command({
    name: "big",
    description: "make your text big",
    options: [
        {
            name: "text",
            description: "The text to make big",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run({ interaction, args, client }) {

        const isAlpha = (str: string) => /^[a-zA-Z]*$/.test(str);
        if (!args[0]) return;

        const text = args.getString("text");
        const bigText = text.split("").map(c => isAlpha(c) ? `:regional_indicator_${c.toLowerCase()}:` : c ).join("");

        // Send embed response
        return await interaction.followUp({ embeds: [client.util.embed("Big Text", Colors.Purple, bigText)] });

    }});