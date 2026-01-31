import { ChannelType, GuildVoiceChannelResolvable, PermissionFlagsBits } from "discord.js";
import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
  name: "carousel",
  description: "move a member around voice channels!",
  defaultMemberPermissions: [PermissionFlagsBits.MoveMembers],
  async run({ message, args, client }) {
    if (!args.length) return;
    // get member from args
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) return;
    // get all voice channels of guild
    const channels = message.guild.channels.cache.filter(
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
