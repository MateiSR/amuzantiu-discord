import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, Colors, PermissionFlagsBits } from "discord.js";

export default new Command({
    name: "ban",
    description: "bans member from guild",
    defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
    options: [{
        name: "member",
        description: "target user",
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async ({ client, interaction, args }) => {

        const member = args.getUser("member");

        await client.guilds.fetch(interaction.guild.id).then(guild => guild.members.fetch(member).then(member => {
            if (member && member.kickable && member.user.id != client.user.id && member.user.id != interaction.user.id && interaction.member.roles.highest.position > member.roles.highest.position) {
                member.ban();
                // send embed reply
                return interaction.followUp({ embeds: [client.util.embed("Kick", Colors.Green, `Successfully kicked ${member.user.tag}`)] });
            }
            else {
                // send embed reply
                return interaction.followUp({ embeds: [client.util.embed("Kick", Colors.Red, `Failed to kick ${member.user.tag}`)] });
            }
        }))

    }
})