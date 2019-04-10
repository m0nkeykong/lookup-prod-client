import * as consts from './consts';

const ENVIROMENTS = {
    DEV: `http://localhost:3000/track/`,
    PROD: `http://99.80.143.62:3000/track/`
}

const trackOriginURL = ENVIROMENTS.DEV;

export function getTrackByIdURL(trackId = '5c7bca6ef318fa537c9c6dbe'){
    return `${trackOriginURL}getTrackById/${trackId}`;
}

export function getTrackDetailsByIdURL(trackId){
    return `${trackOriginURL}getTrackDetailsById/${trackId}`;
}

export function getAllTracksURL(){
    return `${trackOriginURL}getAllTracks`;
}

export function getTracksByCityURL(fromCity,toCity,type){
    return `${trackOriginURL}getTracksByCity/${fromCity}/${toCity}/${type}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}

