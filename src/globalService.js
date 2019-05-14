import * as consts from './consts';

const originURL = 'http://localhost:3000/';

export function getTrackByIdURL(trackId = '5c7bca6ef318fa537c9c6dbe'){
  console.log(`${originURL}track/getTrackById/${trackId}`);
    return `${originURL}track/getTrackById/${trackId}`;
}

export function getTrackDetailsByIdURL(trackId){
    return `${originURL}track/getTrackDetailsById/${trackId}`;
}

export function getAllTracksURL(){
    return `${originURL}track/getAllTracks`;
}

export function getTracksByCityURL(fromCity,toCity,travelmode,Star){
  console.log(`${originURL}track/getTracksByCity/${fromCity}/${toCity}/${travelmode}`);
    return `${originURL}track/getTracksByCity/${fromCity}/${toCity}/${travelmode}/${Star}`;
}

export function getUpdateTrackStarsURL(trackId,Star){
  console.log(`${originURL}track/updateTrackStars/${trackId}/${Star}`);
    return `${originURL}track/updateTrackStars/${trackId}/${Star}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}

export function getGoogleLoginApiKey(){
  return consts.GOOGLE_LOGIN_API_KEY;
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
    console.log(originURL+url);
    return new Promise((resolve, reject) =>{
      fetch(originURL+url, {
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

  export function PostAsyncRequest(url, data) {
    console.log(originURL+url);
    return new Promise((resolve, reject) =>{
      fetch(originURL+url, {
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
  
  
