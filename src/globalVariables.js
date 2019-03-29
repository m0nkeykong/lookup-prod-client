const trackOriginURL = 'http://localhost:3000/track/';

export function getTrackByIdURL(trackId){
    return `${trackOriginURL}getTrackById/${trackId}`;
}

export function getAllTracksURL(){
    return `${trackOriginURL}getAllTracks`;
}