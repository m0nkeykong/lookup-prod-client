import * as consts from './consts';

//const originURL = 'https://db.lookup.band/';
export const originURL = 'http://localhost:3000/';

export const getTrackByIdURL = (trackId = '5c7bca6ef318fa537c9c6dbe') => {
  console.log(`${originURL}track/getTrackById/${trackId}`);
  return `${originURL}track/getTrackById/${trackId}`;
}

export const getTrackDetailsByIdURL = (trackId) => {
  console.log(`${originURL}track/getTrackDetailsById/${trackId}`);
    return `${originURL}track/getTrackDetailsById/${trackId}`;
}

export const getAllTracksURL = () => {
  return `${originURL}track/getAllTracks`;
}

export const  getTracksByCityURL = (fromCity,toCity,travelmode,Star,accesability) => {
  console.log( `${originURL}track/getTracksFilter/${fromCity}/${toCity}/${travelmode}/${Star}/${accesability}`);
    return `${originURL}track/getTracksFilter/${fromCity}/${toCity}/${travelmode}/${Star}/${accesability}`;
}

export const getUpdateDefficultyLevelURL = (trackId, Star) => {
  console.log(`${originURL}track/updateDefficultyLevel/${trackId}/${Star}`);
  return `${originURL}track/updateDefficultyLevel/${trackId}/${Star}`;
}

export const getGoogleApiKey = () => {
  return consts.GOOGLE_API_KEY;
}

export const getGoogleLoginApiKey = () => {
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

        else {
          resolve(false);
        }
      });
  });
}

export const PostAsyncRequest = (url, data) => {
  console.log(originURL + url);
  return new Promise((resolve, reject) => {
    fetch(originURL + url, {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((res) => {
            if (res) {
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

        else {
          resolve(false);
        }
      });
  });
}

export const fetchDataHandleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js 
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
}


