import { ColorResolvable, EmbedBuilder } from 'discord.js';

export default class Util {

    public embed = (title: string, color: ColorResolvable, description?: string) => {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp(new Date())
            .setFooter({ "text": "Amuzantiu | Made with ❤️ by github.com/MateiSR" });
    }

    public formatTime = (millis: number) => {

        // check if live
        if (millis == 9223372036854776000) return "LIVE";
        // format ms
        let sec = Math.floor(millis / 1000);
        const hrs = Math.floor(sec / 3600);
        sec -= hrs * 3600;
        const min = Math.floor(sec / 60);
        sec -= min * 60;

        let secstr = '' + sec;
        secstr = ('00' + sec).substring(secstr.length);

        if (hrs > 0) {
            let minstr = '' + min;
            minstr = ('00' + min).substring(minstr.length);
            return hrs + ":" + min + ":" + sec;
        } else {
            return min + ":" + sec;
        }

    }


}