import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "show the bot's latency in miliseconds",
    run: async ({ client, interaction }) => {
        interaction.followUp(`**Pong!** The ping is \`${client.ws.ping}ms\``)
    }
});
