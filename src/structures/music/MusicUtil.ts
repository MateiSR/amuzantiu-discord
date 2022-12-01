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


    }