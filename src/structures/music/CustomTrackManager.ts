import { CustomMusicTrack } from "../../typings/music/CustomMusicTrack";
import musicList from "../../../config/custom_music.json";

export default class CustomTrackManager {
    tracks: CustomMusicTrack[] = new Array<CustomMusicTrack>;

    constructor() {
        this.load_tracks();
    }

    clear_tracks = async () => {
        this.tracks.splice(0);
    }

    load_tracks = async () => {
        this.clear_tracks();
        for (const customTrack of musicList.map) {
            let _currTrack: CustomMusicTrack = {
                url: customTrack.url,
                callWords: customTrack.callWords,
                filter: customTrack.filter || null,
                emote: customTrack.emote || null,
            };
            this.tracks.push(_currTrack);
        } 
    }

}