import { Event } from "../structures/Event";
import { client } from "..";
import { ExtendedClient } from "../structures/Client";

export default new Event("voiceStateUpdate", (oldState: any, newState: any) => {

    if (!client.shoukaku || oldState.id != client.user.id) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const guildId = oldState.guild.id;

    const dispatcher = client.manager.get(guildId);
    if (!dispatcher || !dispatcher.player) return;

    // Handle disconnect
    if (!newChannel) {
        dispatcher.destroy();
        client.logger.debug(`Disconnected from ${oldState.guild.name} (${oldState.guild.id})`);
        return;
    }

    // Handle moving to a different voice channel
    if (oldChannel && newChannel && oldChannel.id != newChannel.id) {
        dispatcher.switchChannel(newChannel.id);
        client.logger.debug(`Moved to ${newState.guild.name} (${newState.guild.id})`);
        return;
    }

});
