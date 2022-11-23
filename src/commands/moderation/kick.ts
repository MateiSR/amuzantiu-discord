import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, messageLink, PermissionFlagsBits } from "discord.js";

export default new Command({
    name: "kick",
    description: "kicks member from guild",
    defaultMemberPermissions: [PermissionFlagsBits.KickMembers],
    options: [{
        name: "member",
        description: "target user",
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async({client, interaction, args}) => {

        const member = args.getUser("member");

        await client.guilds.fetch(interaction.guild.id).then(guild => guild.members.fetch(member).then (member => {
            if (member && member.kickable && member.user.id != client.user.id && member.user.id != interaction.user.id && interaction.member.roles.highest.position > member.roles.highest.position) {
            member.kick();
            interaction.followUp(`Kicking **${member}..**`);
            }
            else {
                interaction.followUp("I **can't** kick **that** member 😔");
            }
        }))

    }
})