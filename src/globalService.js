import * as consts from './consts';

const originURL = 'http://localhost:3000/';

export function getTrackByIdURL(trackId = '5c7bca6ef318fa537c9c6dbe'){
  console.log(`${originURL}track/getTrackById/${trackId}`);
    return `${originURL}track/getTrackById/${trackId}`;
}

export function getTrackDetailsByIdURL(trackId){
  console.log(`${originURL}track/getTrackDetailsById/${trackId}`);
    return `${originURL}track/getTrackDetailsById/${trackId}`;
}

export function getAllTracksURL(){
    return `${originURL}track/getAllTracks`;
}

export function getTracksByCityURL(fromCity,toCity,travelmode,Star,accesability){
  console.log( `${originURL}track/getTracksFilter/${fromCity}/${toCity}/${travelmode}/${Star}/${accesability}`);
    return `${originURL}track/getTracksFilter/${fromCity}/${toCity}/${travelmode}/${Star}/${accesability}`;
}

export function getUpdateDefficultyLevelURL(trackId,Star){
  console.log(`${originURL}track/updateDefficultyLevel/${trackId}/${Star}`);
    return `${originURL}track/updateDefficultyLevel/${trackId}/${Star}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}

export function getGoogleLoginApiKey(){
  return consts.GOOGLE_LOGIN_API_KEY;
}

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
  
  
