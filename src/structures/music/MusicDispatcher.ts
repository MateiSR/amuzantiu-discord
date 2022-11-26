import { ExtendedClient } from '../Client';
import { DispatcherOptions } from '../../typings/music/DispatcherOptions';
import { client } from '../..';
import { Colors, Guild, GuildBasedChannel, TextChannel } from 'discord.js';
import { Player, Track } from 'shoukaku';
import { Youtube } from '../../handlers/youtube';

export default class MusicDispatcher {

    //queue = [];
    // save dispatchers in a collection
    // dispatchers = new Collection<string, MusicDispatcher>();
    //

    client: ExtendedClient = client;
    player: Player;
    queue: Track[] = new Array<Track>;
    guildId: string;
    guild: Guild;
    textChannelId: string | undefined;
    current: Track = null;
    previous: Track = null;
    end: boolean = false;
    loop: string = "queue" || "track" || "none";

    constructor(options: DispatcherOptions) {
        this.player = options.player;
        this.guild = options.guild || this.client.guilds.cache.get(options.guildId);
        this.guildId = options.guild.id;
        this.textChannelId = options.textChannelId;


        // Events
        this.player.on("start" , () => this.onTrackStart())
            .on("end", () => this.onTrackEnd())
            .on("exception", () => this.onTrackException())

    }

    onTrackStart = async () => {
        // Send embed corresponding to the track
        const channel = this.guild.channels.cache.get(this.textChannelId) as TextChannel;
        // get member name
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
                value: requester.user.tag,
                inline: true
            }])]});
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
        console.log("Track exception");
    }

    get exists() {
        return this.client.manager.has(this.guild.id);
    }

    async play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player.playTrack({ track: this.current.track });
    }

    destroy() {
        this.player.clean();
        this.client.manager.delete(this.guild.id);
    }

}