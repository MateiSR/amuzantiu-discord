import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command ({
    name: "role",
    description: "gives role to mentioned user",
    defaultMemberPermissions: [PermissionFlagsBits.ManageRoles],
    options: [
        // to add subcommands for @everyone / role removal
        {
        name: "role",
        description: "which role to give",
        type: ApplicationCommandOptionType.Role,
        required: true
    },
    {
        name: "member",
        description: "member to give role to",
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    run: async({client, interaction, args}) => {

        const member = args.getUser("member");
        const role_field = args.getRole("role");


        const guild = client.guilds.cache.get(interaction.guild.id);
        const role = guild.roles.cache.get(role_field.id);

        await client.guilds.fetch(interaction.guild.id).then(guild => guild.members.fetch(member).then (async member => {
            try {
                await member.roles.add(role);
                interaction.followUp(`**${member}** received role **${role.name}** 😔`);
            } catch (error) {
                interaction.followUp(`**An error occured 🥲**\n\`\`\`${error}\`\`\``);
            }
        }))

    }
})