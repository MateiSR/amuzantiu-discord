import { ExtendedClient } from '../Client';
import { DispatcherOptions } from '../../typings/music/DispatcherOptions';
import { client } from '../..';
import { Colors, Guild, TextChannel } from 'discord.js';
import { Player, Track } from 'shoukaku';
import { filters } from './MusicAssets';

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
    loop: string = "none" || "track" || "queue";

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
        // if dispatcher.loop === "track", return
        if (this.loop === "track") return;
        // Send embed corresponding to the track
        const channel = this.guild.channels.cache.get(this.textChannelId) as TextChannel;
        // Get GuildMember from track author
        const requester = await this.guild.members.fetch(this.current.info.author);
        await channel.send({embeds: [client.util.embed("🎵   Now playing", Colors.Blue, `[${this.current.info.title}](${this.current.info.uri})`)
            .setThumbnail(client.manager.util.getYouTubeThumbnail(this.current.info.uri, "small"))
            .addFields([{
                name: "Source",
                value: this.current.info.sourceName == "youtube" ? `[YouTube](${this.current.info.uri})` : this.current.info.sourceName,
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
        } else if (this.loop === "queue") {
            this.queue.push(this.previous);
        }
        if (this.queue.length) {
            await this.play();
        } else {
            this.end = true;
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

    async switchChannel(channelId: string) {
        this.voiceChannelId = channelId;
    }

    // get queue total duration
    get totalDuration() {
        if (!this.exists || !this.queue.length) return 0;
        let total = 0;
        this.queue.forEach(track => {
            total += track.info.length;
        });
        return total;
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.end = false;
        this.current = this.queue.shift();
        this.player.playTrack({ track: this.current.track });
    }

    async playPrevious() {
        if (!this.player) return;
        if (!this.previous) return;
        this.queue.unshift(this.previous);
        this.player.stopTrack();
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
        if (skipTo > this.queue.length && !this.current) return;
        if (skipTo > 1) {
            this.queue = this.queue.slice(skipTo - 1);
        }
        this.player.stopTrack();
        if (this.player.paused) this.resume();
    }

    async stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.loop = "none";
        this.player.stopTrack();
        this.destroy();
    }

    async shuffle() {
        if (!this.player) return;
        this.queue = client.util.shuffleArray(this.queue);
    }

    async setFilter(filterOption: string) {
        if (!this.player) return;
        // if already has filters, remove them
        if (this.player.filters) this.player.clearFilters();
        const filter = filters.get(filterOption) || null;
        if (!filter) return new Error("Invalid filter option");
        this.player.setFilters(filter);
    }

    async switchTextChannel(channelId: string) {
        if (!this.player) return;
        if (channelId === this.textChannelId) return;
        this.textChannelId = channelId;
    }

    destroy() {
        this.player.clean();
        this.player.connection.disconnect();
        this.client.manager.delete(this.guild.id);
    }

}