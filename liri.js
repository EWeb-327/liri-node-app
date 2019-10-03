require("dotenv").config();
var Spotify = require("node-spotify-api")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var axios = require("axios")
var moment = require('moment');
var fs = require("fs");

var command = process.argv[2]
var input = process.argv.slice(3).join(" ")

function append(text){
    fs.appendFile("log.txt", text, function(err){
        if (err) {
            console.log(err);
          }else{
            return true
          }
    })
}

console.log("---------------")
console.log("Choose a command:\nconcert-this (artist name)\nspotify-this-song (song name)\nmovie-this (name of a movie)\ndo-what-it-says *picks randomly for you*")

function run(){
if (command === "concert-this") {
    axios
        .get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log(input)
            for (var i = 0; i < 5; i++) {
                var date = moment(response.data[i].datetime).format('MM/DD/YYYY')
                var text = `\n---------------\nName of Venue: ${response.data[i].venue.name}\nVenue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}\nDate of the Event: ${date}\n`
                console.log(text)
                append(text)
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
} else if (command === "spotify-this-song") {
    if (!input) {
        spotify
            .search(
                { type: 'track', query: "The Sign" })
            .then(function (response) {
                console.log(`\n---------------\nArtist(s): ${response.tracks.items[5].album.artists[0].name}\nSong Name: ${response.tracks.items[5].name}\nPreview Link: ${response.tracks.items[5].external_urls.spotify}\nAlbum: ${response.tracks.items[5].album.name}\n`)
            }
            )
            .catch(function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(data);
            });
    } else {
        spotify
            .search(
                { type: 'track', query: input })
            .then(function (response) {
                for (var i = 0; i < 5; i++) {
                    var text = `\n---------------\nArtist(s): ${response.tracks.items[i].album.artists[0].name}\nSong Name: ${response.tracks.items[i].name}\nPreview Link: ${response.tracks.items[i].external_urls.spotify}\nAlbum: ${response.tracks.items[i].album.name}\n`
                    console.log(text)
                    append(text)
                }
            })
            .catch(function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log(data);
            });
    }
}else if (command === "movie-this") {
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
    if (!input) {
        queryUrl = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
            function (response) {
                console.log(`\n---------------\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nProduced in: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n`)
            }
        ).catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    } else {
        axios.get(queryUrl).then(
            function (response) {
                var text = `\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nProduced in: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}\n`
                console.log(text)
                append(text)
            }
        ).catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    }
}else if (command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error,data){
        if (error) {
            return console.log(error)
        } else{
            var dataArr = data.split(",")
            command = dataArr[0]
            input = dataArr[1]
            run()
        }
    })
}}
run()