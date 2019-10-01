require("dotenv").config();
var spotifyAPI = require("node-spotify-api")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var command = process.argv.slice(2).join(" ")

console.log(command)