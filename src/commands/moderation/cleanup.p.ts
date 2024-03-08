import { PermissionFlagsBits, TextChannel } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";
import { client } from "../../index";

export default new PrefixCommand({
  name: "cleanup",
  description: "cleans up bot messages on current channel",
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  run: async ({ client, message, args }) => {
    const LIMIT = 100;
    const channel: TextChannel = message.channel as TextChannel;

    const messages = (await channel.messages.fetch({ limit: LIMIT })).filter(
      (m) => m.author.id === client.user.id || client.util.isBotCommandCall(m),
    );

    for (const msg in messages) console.log(message.content);

    try {
      await channel.bulkDelete(messages, true).then(async () => {
        return await channel
          .send(
            `✅ Deleted bot command calls & replies\n**NOTE:\nThe messages have to be 14 days old at most.\n Only command calls from the last 100 messages in this channel have been deleted, due to Discord API Limitations.**`,
          )
          .then((m) => setTimeout(() => m.delete(), 5000));
      });
    } catch (error) {
      return await channel
        .send(`**Error encountered:**\n \`\`\`${error.toString()}\`\`\``)
        .then((m) => setTimeout(() => m.delete(), 5000));
    }
  },
});
