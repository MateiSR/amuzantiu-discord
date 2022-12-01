import fetch from 'isomorphic-unfetch';
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch);

export default class MusicUtil {

    public getYouTubeThumbnail = (url: string, size: string = "small") => {
        var video, results;

            if (url === null) {
                return '';
            }
            size = (size === null) ? 'big' : size;
            results = url.match('[\\?&]v=([^&#]*)');
            video = (results === null) ? url : results[1];

            if (size === 'small') {
                return 'http://img.youtube.com/vi/' + video + '/2.jpg';
            }
            return 'http://img.youtube.com/vi/' + video + '/0.jpg';
        };

    public isSpotify = (url: string) => {
        return /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/.test(url);
    }

    // check if query is either album playlist or track
    private isSpotifyPlaylist = (url: string) => {
        return /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(playlist)(?:[/:])([A-Za-z0-9]+).*$/.test(url);
    }

    private isSpotifyAlbum = (url: string) => {
        return /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album)(?:[/:])([A-Za-z0-9]+).*$/.test(url);
    }

    private isSpotifyTrack = (url: string) => {
        return /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(track)(?:[/:])([A-Za-z0-9]+).*$/.test(url);
    }

    public getSpotify = (url: string) => {
        if (!this.isSpotify(url)) return null; // invalid
        if (this.isSpotifyAlbum) return "album";
        else if (this.isSpotifyTrack) return "track";
        else if (this.isSpotifyPlaylist) return "playlist";
    }

    // fetch spotify tracks
    public fetchSpotifyTracks = async (url: string) => {
        const tracks = await getTracks(url);
        if (!tracks) return null;
        const results = new Array<string>();
        tracks.forEach(element => {
            let result = new Array<string>();
            result.push(element.name + " - ");
            element.artists.forEach(artist => {
                result.push(artist.name + ", ");
            });
            results.push(result.join(" "));
        });
        return results;
    }


    }