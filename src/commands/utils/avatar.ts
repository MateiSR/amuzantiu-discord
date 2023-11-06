import { ApplicationCommandOptionType, Colors } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "avatar",
    description: "Fetches the avatar of a user",
    options: [{
        name: "user",
        description: "the user you want to fetch the avatar of",
        type: ApplicationCommandOptionType.User,
        required: false
    }],
    run: async ({ client, interaction, args }) => {
        const user = args.getUser("user") || interaction.user;
        const avatar = user.displayAvatarURL({ extension: "png", size: 1024 });
        await interaction.followUp({ embeds: [client.util.embed(`${user.username}'s avatar`, Colors.Green, `[Avatar](${avatar})`)] });
    }
});