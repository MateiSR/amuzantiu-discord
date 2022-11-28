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

    public formatTime = (millis: number, unit: boolean = false) => {

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

        let minstr = '' + min;
            minstr = ('00' + min).substring(minstr.length);

        if (unit) {
            if (hrs > 0) return hrs + ':' + minstr + ':' + secstr + ' hours';
            else if (min > 0) return minstr + ':' + secstr + ' minutes';
            else if (sec > 0) {
                if (secstr[0] == '0') return secstr[1] + ' seconds';
                else return secstr + ' seconds';
            }
            else if (sec == 0) return '0 seconds';
        }

        if (hrs > 0) {
            return hrs + ":" + minstr + ":" + secstr;
        } else {
            return minstr + ":" + secstr;
        }

    }

    public durationToMillis(duration: string) {
        return duration.split(':').map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    // chunk array
    public chunk = (array: any[], size: number) => {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }

    public randomInt = (max, min) => Math.round(Math.random() * (max - min)) + min;

    public randomArray(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    public shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

}