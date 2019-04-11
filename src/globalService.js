import * as consts from './consts';

const trackOriginURL = 'http://localhost:3000/';

export function getTrackByIdURL(trackId = '5c7bca6ef318fa537c9c6dbe'){
    return `${trackOriginURL}track/getTrackById/${trackId}`;
}

export function getTrackDetailsByIdURL(trackId){
    return `${trackOriginURL}track/getTrackDetailsById/${trackId}`;
}

export function getAllTracksURL(){
    return `${trackOriginURL}track/getAllTracks`;
}

export function getTracksByCityURL(fromCity,toCity,type){
    return `${trackOriginURL}track/getTracksByCity/${fromCity}/${toCity}/${type}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}


/**
 * 
 * Description about this function:
 * 
 * for insert a new point send:
 * url = 'point/insertPoint'
 * data = {
 *          "city":"city name",
 *          "latitude":100,
 *          "longitude":100
 *        }
 * 
 * for insert a new track send:
 * url = 'track/insertTrack'
 * data = {
 *          "type":"Walking",
 *          "title":"some title",
 *          "startPoint":point._id (like: 5ca0ec347fd3dd5137edb1dc),
 *          "endPoint": point._id,
 *          "wayPoint":[point._id,point._id,point._id],
 *          "description": "some description"
 *        }
 * 
 */
export function PostRequest(url, data) {
    console.log(trackOriginURL+url);
    return new Promise((resolve, reject) =>{
      fetch(trackOriginURL+url, {
        method: 'POST',
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
      })
        .then((response)=>{
          if(response.status===200){
            response.json().then((res) => {
              if(res){
              console.log(res);
                resolve(res); 
              }
              else
                resolve(false);
            })
          .catch((error) => {
            console.log(resolve);
            resolve(error);
          });
        }
        
        else{
        resolve(false);}
    });
    });
  }
  
  
