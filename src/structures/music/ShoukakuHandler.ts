import { Shoukaku, Connectors } from 'shoukaku';

const options = {
    moveOnDisconnect: false,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 240000
};

const nodes = [{
    name: 'Music Node 1',
    url: process.env.LavalinkURL,
    auth: process.env.LavalinkPassword
}];

export default class ShoukakuHandler extends Shoukaku {
    constructor(client) {
        super(new Connectors.DiscordJS(client), nodes, options);


    this.on('ready', (name, reconnected) => {
        client.logger.info(`Shoukaku Node ${name} `, reconnected ? 'reconnected' : 'connected');
    });

    this.on('error', (name, error) => {
        client.logger.error(`Shoukaku Node ${name} had an error: ${error.message}`);
    });

    this.on('close', (name, code, reason) => {
        client.logger.warn(`Shoukaku Node ${name} closed with code ${code} and reason ${reason}`);
    });

    this.on('disconnect', (name, players, moved) => {
        client.logger.warn(`Shoukaku Node ${name} disconnected; `, moved ? 'players have been moved' : 'players have been disconnected');
    });

    this.on('debug', (name, reason) => {
        if (client.environment == 'debug') client.logger.debug(`Shoukaku Node ${name} debug: ${reason}`);
    })


}
}