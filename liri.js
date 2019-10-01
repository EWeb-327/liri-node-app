require("dotenv").config();
var Spotify = require("node-spotify-api")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require("axios")
var moment = require('moment');

var command = process.argv[2]
var input = process.argv.slice(3).join(" ")

console.log("---------------")

if(command === "concert-this"){
    axios
    .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function(response){
        for(var i = 0; i<5; i++){
        var date = moment(response.data[i].datetime).format('MM/DD/YYYY')
        console.log(`Name of Venue: ${response.data[i].venue.name}\nVenue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}\nDate of the Event: ${date}\n`)
        }
    })
    .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
} else if(command === "spotify-this-song"){
    if(!input){
        spotify
        .search(
            {type:'track', query: "The Sign"})
        .then(function(response){
            console.log(`Artist(s): ${response.tracks.items[5].album.artists[0].name}\nSong Name: ${response.tracks.items[5].name}\nPreview Link: ${response.tracks.items[5].external_urls.spotify}\nAlbum: ${response.tracks.items[5].album.name}\n`)
            }
        )
        .catch(function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
          console.log(data); 
          });
    } else {
    spotify
    .search(
        { type: 'track', query: input})
    .then(function(response){
        for(var i = 0; i<5; i++){
        console.log(`Artist(s): ${response.tracks.items[i].album.artists[0].name}\nSong Name: ${response.tracks.items[i].name}\nPreview Link: ${response.tracks.items[i].external_urls.spotify}\nAlbum: ${response.tracks.items[i].album.name}\n`)
        }
    })
    .catch(function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
    }
}