import { Guild, GuildMember } from 'discord.js';
import { Player, Track } from 'shoukaku';
import { ExtendedClient } from '../../structures/Client';

export type ManagerOptions = {
    client?: ExtendedClient;
    guildId: string;
    guild?: Guild;
    VoiceChannelId?: string;
    TextChannelId?: string;
    member?: GuildMember;
    track: Track;
}