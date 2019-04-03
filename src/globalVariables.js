import * as consts from './consts';

const trackOriginURL = 'http://localhost:3000/track/';

export function getTrackByIdURL(trackId = '5c7bca6ef318fa537c9c6dbe'){
    return `${trackOriginURL}getTrackById/${trackId}`;
}

export function getTrackDetailsByIdURL(trackId){
    return `${trackOriginURL}getTrackDetailsById/${trackId}`;
}

export function getAllTracksURL(){
    return `${trackOriginURL}getAllTracks`;
}

export function getTracksByCityURL(city){
    return `${trackOriginURL}getTracksByCity/${city}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}

