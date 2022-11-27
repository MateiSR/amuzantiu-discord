import { PermissionFlagsBits, TextChannel } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
    name: "purge",
    description: "purges last <1-100> messages",
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
    run: async ({ client, message, args }) => {

        if (!args[0]) return;
        if (isNaN(parseInt(args[0]))) return;
        // Check if amount is between 1 and 100
        if (parseInt(args[0]) < 1 || parseInt(args[0]) > 100) return await message.reply("Please enter a number between 1 and 100");

        const amount: number = parseInt(args[0]);
        const messages = await message.channel.messages.fetch({
            limit: amount
        });

        try {
            const channel = message.channel as TextChannel;
            await channel.bulkDelete(messages, true).then(async () => {
                return await message.channel.send(`✅ **Succesfully deleted messages** *newer than 2 weeks*`).then(m => setTimeout(() => m.delete(), 2500));
            });
        } catch (error) {
            return await message.channel.send(`You cannot delete messages that are older than **14 days old**.`);
        }

    }
})