import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

export default new Command({
    name: "disconnect",
    description: "disconnect mentioned member from voice",
    defaultMemberPermissions: [PermissionFlagsBits.MoveMembers],
    options: [{
        name: "member",
        description: "target user",
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async({client, interaction, args}) => {

        const member = args.getUser("member");

        await client.guilds.fetch(interaction.guild.id).then(guild => guild.members.fetch(member).then (member => {
            if (!member.voice.channelId) interaction.followUp(`**${member}** is **not in a voice channel** 😔`);
            else {
                member.voice.disconnect();
                interaction.followUp(`**Disconnected ${member}** 🥲`);
            }
        }))

    }
})