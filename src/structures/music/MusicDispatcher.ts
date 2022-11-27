import { ExtendedClient } from '../Client';
import { DispatcherOptions } from '../../typings/music/DispatcherOptions';
import { client } from '../..';
import { Colors, Guild, GuildBasedChannel, TextChannel } from 'discord.js';
import { Player, Track } from 'shoukaku';
import { Youtube } from '../../handlers/youtube';

export default class MusicDispatcher {

    client: ExtendedClient = client;
    player: Player;
    queue: Track[] = new Array<Track>;
    guildId: string;
    guild: Guild;
    textChannelId: string | undefined;
    voiceChannelId: string | undefined;
    current: Track = null;
    previous: Track = null;
    end: boolean = false;
    loop: string = "queue" || "track" || "none";

    constructor(options: DispatcherOptions) {
        this.player = options.player;
        this.guild = options.guild || this.client.guilds.cache.get(options.guildId);
        this.guildId = options.guild.id;
        this.textChannelId = options.textChannelId;
        this.voiceChannelId = options.voiceChannelId;


        // Events
        this.player.on("start" , () => this.onTrackStart())
            .on("end", () => this.onTrackEnd())
            .on("exception", () => this.onTrackException())

    }

    onTrackStart = async () => {
        // Send embed corresponding to the track
        const channel = this.guild.channels.cache.get(this.textChannelId) as TextChannel;
        // Get GuildMember from track author
        const requester = await this.guild.members.fetch(this.current.info.author);
        await channel.send({embeds: [client.util.embed("🎵   Now playing", Colors.Blue, `[${this.current.info.title}](${this.current.info.uri})`)
            .setThumbnail(Youtube.thumb(this.current.info.uri, "small"))
            .addFields([{
                name: "Source",
                value: this.current.info.sourceName,
                inline: true
            },
            {
                name: "Duration",
                value: this.current.info.isStream ? "LIVE" : client.util.formatTime(this.current.info.length),
                inline: true
            },
            {
                name: "Requested by",
                value: requester.toString(),
                inline: true
            }])]});
            this.client.logger.debug(`Now playing ${this.current.info.title} in ${this.guild.name} (${this.guild.id}) --- Requested by ${requester.user.tag}`);
    }

    onTrackEnd = async () => {
        this.previous = this.current;
        this.current = null;
        if (this.loop === "track") {
            this.queue.unshift(this.previous);
        }
        if (this.loop === "none") {
            this.queue.shift();
        }
        if (this.queue.length) {
            await this.play();
        } else {
            this.end = true;
            this.player.clean();
        }
    }

    onTrackException = async () => {
        const channel = this.guild.channels.cache.get(this.textChannelId) as TextChannel;
        // send embeds corresponding to the exception, and the track
        await channel.send({embeds: [client.util.embed("⚠️   Exception encountered while trying to play track", Colors.Red, `[${this.current.info.title}](${this.current.info.uri})`)]});
        this.client.logger.debug(`Exception encountered while trying to play track ${this.current.info.title}`);
    }

    get exists() {
        return this.client.manager.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player.playTrack({ track: this.current.track });
    }

    async pause() {
        if (!this.player) return;
        this.player.setPaused(true);
    }

    async resume() {
        if (!this.player) return;
        this.player.setPaused(false);
    }

    async skip(skipTo = 1) {
        if (!this.player) return;
        if (skipTo > this.queue.length) return;
        if (skipTo > 1) {
            this.queue = this.queue.slice(skipTo - 1);
        }
        //this.player.stopTrack();
    }

    async stop() {
        if (!this.player) return;
        this.queue = [];
        this.loop = "none";
        this.player.stopTrack();
    }

    /* to be done
    async shuffle() {
        if (!this.player) return;
        this.queue = client.util.shuffle(this.queue);
    }
    */

    destroy() {
        this.player.clean();
        this.client.manager.delete(this.guild.id);
    }

}