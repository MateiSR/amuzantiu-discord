import { Colors } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

const answers_yes = [
  "As I see it, yes",
  "It is certain",
  "It is decidedly so",
  "Most likely",
  "Outlook good",
  "Signs point to yes",
  "Without a doubt",
  "Yes",
  "Yes - definitely",
  "You may rely on it",
];
const answers_maybe = [
  "Reply hazy, try again",
  "Ask again later",
  "Better not tell you now",
  "Cannot predict now",
  "Concentrate and ask again",
];
const answers_no = [
  "Don't count on it",
  "My reply is no",
  "My sources say no",
  "Outlook not so good",
  "Very doubtful",
];

export default new PrefixCommand({
  name: "8ball",
  description: "ask the magic 8ball a question",
  async run({ message, args, client }) {
    if (!args.length)
      return await message.reply({
        embeds: [
          client.util.embed(
            "8ball",
            Colors.NotQuiteBlack,
            "You need to ask a question",
          ),
        ],
      });
    const question = args.join(" ");
    // get random answer
    const option = client.util.randomInt(0, 2);
    const answer =
      option == 0
        ? client.util.randomArray(answers_yes)
        : option == 1
          ? client.util.randomArray(answers_maybe)
          : client.util.randomArray(answers_no);
    // Send embed response
    return await message.reply({
      embeds: [
        client.util.embed(
          "8ball",
          Colors.DarkPurple,
          `**Question:** ${question}\n**Answer:** ${answer}`,
        ),
      ],
    });
  },
});
