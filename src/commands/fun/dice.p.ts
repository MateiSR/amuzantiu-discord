import { PrefixCommand } from "../../structures/PrefixCommand";
import { Colors } from "discord.js";

export default new PrefixCommand({
  name: "dice",
  description: "a game of dice.. with an AI",
  async run({ message, args, client }) {
    var rolls = [];
    const names = [
      "Hugh Jass",
      "Mike Hawk",
      "Ben Dover",
      "Dixie Normous",
      "Barry McKockiner",
    ];
    // gets rolls
    let i = 0;
    while (i < 4) {
      rolls.push(client.util.randomInt(1, 6));
      i++;
    }

    // gets winner
    const winner = rolls.indexOf(Math.max(...rolls));
    const loser = rolls.indexOf(Math.min(...rolls));
    const authorWins = client.util.randomInt(0, 1);
    const winnerName = authorWins ? message.author : names[winner];
    const loserName = authorWins ? names[loser] : message.author;
    const winnerRoll = rolls[winner];
    const loserRoll = rolls[loser];

    // Send embed response
    return await message.reply({
      embeds: [
        client.util.embed(
          "Dice",
          Colors.Gold,
          `**${winnerName}** wins with a roll of **${winnerRoll}**!\n**${loserName}** loses with a roll of **${loserRoll}**!`,
        ),
      ],
    });
  },
});
