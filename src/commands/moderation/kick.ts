import { Command } from "../../structures/Command";
import {
  ApplicationCommandOptionType,
  Colors,
  PermissionFlagsBits,
} from "discord.js";

export default new Command({
  name: "kick",
  description: "kicks member from guild",
  defaultMemberPermissions: [PermissionFlagsBits.KickMembers],
  options: [
    {
      name: "member",
      description: "target user",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async ({ client, interaction, args }) => {
    const member = args.getUser("member");
    const memberTag = `${member.username}#${member.discriminator}`;

    await client.guilds.fetch(interaction.guild.id).then((guild) =>
      guild.members.fetch(member).then((member) => {
        if (
          member &&
          member.kickable &&
          member.user.id != client.user.id &&
          member.user.id != interaction.user.id &&
          interaction.member.roles.highest.position >
          member.roles.highest.position
        ) {
          member.kick();
          // send embed reply
          return interaction.followUp({
            embeds: [
              client.util.embed(
                "Kick",
                Colors.Green,
                `Successfully kicked ${memberTag}`,
              ),
            ],
          });
        } else {
          // send embed reply
          return interaction.followUp({
            embeds: [
              client.util.embed(
                "Kick",
                Colors.Red,
                `Failed to kick ${memberTag}`,
              ),
            ],
          });
        }
      }),
    );
  },
});
