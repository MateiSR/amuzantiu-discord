import { PrefixCommand } from "../../structures/PrefixCommand";

export default new PrefixCommand({
    name: "ping",
    description: "show the bot's latency in miliseconds",
    run: async ({ client, message, args }) => {
        message.reply(`**Pong!** The ping is \`${client.ws.ping}ms\``)
    }
});
