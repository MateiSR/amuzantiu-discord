import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "coinflip",
  description: "flip a coin",
  async run({ message, client }) {
    const coin = client.util.randomInt(0, 1) ? "heads" : "tails";
    // Send embed response
    return await message.reply({
      embeds: [
        client.util.embed(
          "Coinflip",
          Colors.Purple,
          `The coin landed on **${coin}**`,
        ),
      ],
    });
  },
});
