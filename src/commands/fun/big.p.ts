import { PrefixCommand } from "../../structures/PrefixCommand";
import { Colors } from "discord.js";

export default new PrefixCommand({
  name: "big",
  description: "make your text big",
  async run({ message, args, client }) {
    const isAlpha = (str: string) => /^[a-zA-Z]*$/.test(str);

    if (!args[0]) return;

    const text = args.join(" ");
    const bigText = text
      .split("")
      .map((c) => (isAlpha(c) ? `:regional_indicator_${c.toLowerCase()}:` : c))
      .join("");

    // Send embed response
    return await message.reply({
      embeds: [client.util.embed("Big Text", Colors.Purple, bigText)],
    });
  },
});
