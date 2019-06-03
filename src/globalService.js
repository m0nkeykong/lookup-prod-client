import * as consts from './consts';

export const originURL = 'http://localhost:3000/';

export const getTrackByIdURL = (trackId = '5c7bca6ef318fa537c9c6dbe') => {
  console.log(`${originURL}track/getTrackById/${trackId}`);
  return `${originURL}track/getTrackById/${trackId}`;
}

export const getTrackDetailsByIdURL = (trackId) => {
  return `${originURL}track/getTrackDetailsById/${trackId}`;
}

export const getAllTracksURL = () => {
  return `${originURL}track/getAllTracks`;
}

export const getTracksByCityURL = (fromCity, toCity, travelmode, Star) => {
  console.log(`${originURL}track/getTracksByCity/${fromCity}/${toCity}/${travelmode}`);
  return `${originURL}track/getTracksFilter/${fromCity}/${toCity}/${travelmode}/${Star}/false`;
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
export const PostRequest = (url, data) => {
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


