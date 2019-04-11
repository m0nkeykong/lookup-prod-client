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

export function getTracksByCityURL(fromCity,toCity,type){
    return `${trackOriginURL}getTracksByCity/${fromCity}/${toCity}/${type}`;
}

export function getGoogleApiKey(){
    return consts.GOOGLE_API_KEY;
}



export function PostData(type, userData) {
    let BaseURL = 'https://jemusic.herokuapp.com/';
    return new Promise((resolve, reject) =>{
      fetch(BaseURL+type, {
        method: 'POST',
        credentials: "same-origin", 
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(userData)
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
  
  
