import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";

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

export default new Command({
  name: "8ball",
  description: "ask the magic 8ball a question",
  options: [
    {
      name: "question",
      description: "The question to ask",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run({ interaction, args, client }) {
    const question = args.getString("question");
    // get random answer
    const option = client.util.randomInt(0, 2);
    const answer =
      option == 0
        ? client.util.randomArray(answers_yes)
        : option == 1
          ? client.util.randomArray(answers_maybe)
          : client.util.randomArray(answers_no);
    // Send embed response
    return await interaction.followUp({
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
