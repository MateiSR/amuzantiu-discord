import {
  ApplicationCommandOptionType,
  ChannelType,
  GuildVoiceChannelResolvable,
  GuildMember,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  name: "carousel",
  description: "move a member around voice channels!",
  options: [
    {
      name: "member",
      description: "The member to move",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run({ interaction, args, client }) {
    await interaction.deferReply();
    // get member from args
    const member = args.getMember("member") as GuildMember;
    // get all voice channels of guild
    const channels = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice,
    );

    // save member channel
    const memberChannel = member.voice.channel;

    // move member to each channel
    let i = 0;
    for (const channel of channels.values()) {
      ++i;
      if (i == 9) break; // discord rate limit
      await member.voice.setChannel(channel as GuildVoiceChannelResolvable);
    }

    // move member back to original channel
    await member.voice.setChannel(memberChannel);
  },
});
