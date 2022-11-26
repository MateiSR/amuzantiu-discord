import { Collection } from "discord.js";
import { client } from "../..";
import { ExtendedClient } from "../Client";
import MusicDispatcher from "./MusicDispatcher";
import { ManagerOptions } from "../../typings/music/ManagerOptions";

export default class MusicManager extends Collection<string, MusicDispatcher> { // guildId, Dispatcher

    client: ExtendedClient = client;

    constructor() {
        super();
    }

    async handleDispatcher(options: ManagerOptions) {
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
            deaf: true});
        //this.client.logger.debug(`New music connection to ${options.guildId}`);

        const dispatcher = new MusicDispatcher({
            client: this.client,
            guildId: options.guildId,
            guild: options.guild,
            textChannelId: options.TextChannelId,
            player: player
        });

        dispatcher.queue.push(options.track);
        this.set(options.guildId, dispatcher);
        //this.client.logger.debug(`New music dispatcher to ${options.guildId}`);
        return dispatcher;

    }

}