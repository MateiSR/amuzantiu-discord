import { Collection } from "discord.js";
import { client } from "../..";
import { ExtendedClient } from "../Client";
import MusicDispatcher from "./MusicDispatcher";
import { ManagerOptions } from "../../typings/music/ManagerOptions";
import MusicUtil from './MusicUtil';
import { Client } from "genius-lyrics";

export default class MusicManager extends Collection<string, MusicDispatcher> { // guildId, Dispatcher

    client: ExtendedClient = client;
    util: MusicUtil = new MusicUtil();
    genius: Client;

    constructor() {
        super();
        this.genius = new Client();
    }

    async handleDispatcher(options: ManagerOptions) {
        client.logger.debug(`Handling dispatcher for ${options.guild.name} (${options.guild.id})`);
        const existingDispatcher = this.get(options.guildId);

        // If the dispatcher has been already initalized
        if (existingDispatcher) {
            existingDispatcher.queue.push(options.track);
            if (!existingDispatcher.current) await existingDispatcher.play();
            return;
        }

        // If the dispatcher has not been initalized
        const node = client.shoukaku.getNode();
        const player = await node.joinChannel({
            guildId: options.guildId,
            shardId: 0,
            channelId: options.VoiceChannelId,
            deaf: true
        });
        client.logger.debug(`New music connection to ${options.guild.name} (${options.guild.id})`);

        const dispatcher = new MusicDispatcher({
            client: client,
            guildId: options.guildId,
            guild: options.guild,
            textChannelId: options.TextChannelId,
            voiceChannelId: options.VoiceChannelId,
            player: player
        });

        dispatcher.queue.push(options.track);
        this.set(options.guildId, dispatcher);
        client.logger.debug(`New music dispatcher to ${options.guild.name} (${options.guild.id})`);
        return dispatcher;

    }

}