import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "spoiler",
  description: "spoiler your text",
  options: [
    {
      name: "text",
      description: "The text to spoiler",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run({ interaction, args, client }) {
    const text = args.getString("text");
    // spoiler every character
    const reply = text
      .split("")
      .map((c) => `||${c}||`)
      .join("");
    return await interaction.followUp(reply);
  },
});
