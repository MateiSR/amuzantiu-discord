import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "spoiler",
  description: "spoiler your text",
  async run({ message, args, client }) {
    if (!args.length) return;
    let reply = args.join(" ");
    // spoiler every character
    reply = reply
      .split("")
      .map((c) => `||${c}||`)
      .join("");
    return await message.reply(reply);
  },
});
