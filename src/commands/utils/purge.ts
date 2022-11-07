import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default new Command({
    name: "purge",
    description: "purges last <1-100> messages",
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
    options: [{
        name: "amount",
        description: "how many messages to delete",
        type: ApplicationCommandOptionType.Integer,
        min_value: 1,
        max_value: 100,
        required: true
    }],
    run: async({client, interaction, args}) => {

        const amount: number = args.getInteger("amount");
        const messages = await interaction.channel.messages.fetch({
            limit: amount
        });

        try {
        await interaction.channel.bulkDelete(messages, true).then(async () => {
            await interaction.channel.send(`✅ **Succesfully deleted messages** *newer than 2 weeks*`).then(m => setTimeout(() => m.delete(), 2500));
        }); } catch (error) {
            await interaction.channel.send(`You cannot delete messages that are older than **14 days old**.`);
            try {await interaction.deferReply();}catch(e){};
        }

    }
})