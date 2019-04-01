export function load_google_maps(){ 
    return new Promise(function(resolve,reject){
        window.resolveGoogleMapsPromise = function() {
            resolve(window.google);
            // delete the blobal callback to tidy up since it is no longer needed
            delete window.resolveGoogleMapsPromise;
        }

        // now load the google maps api
        const script = document.createElement("script");
        const API_KEY = 'AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc';
        script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
        script.async = true;
        document.body.appendChild(script);
    });
}

export function load_places(){
    let city= "Silver Spring, MD";
    let query = 'Shopping';
    var api_url = `https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=50&near=${city}&query=${query}`;

    return fetch(api_url).then(resp=>resp.json());

}