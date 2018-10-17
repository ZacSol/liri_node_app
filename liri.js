require('dotenv').config();
const fs=require('fs');
const request=require("request");
let userCommand=process.argv[2];

//capitalizes the first character of a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// checks BandsInTown for upcoming concerts and displays venue name and location
function upcomingConcerts(){
     // let artist="avengedsevenfold";
     let artist = "";
     let artistName="";
     for (let i = 3; i < process.argv.length; i++) {
         artist += process.argv[i];
         artistName+=process.argv[i].capitalize()+" ";
     }
     artistName = artistName.slice(0,-1);
    //  console.log(artist,artistName,typeof(artistName));
     request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, res, body) {
         if (error) {
             console.log('error:', error); // Print the error if one occurred
         }
         console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
         // console.log('body:', body); // Print the HTML for the Google homepage.
         res.body = JSON.parse(res.body);
         // console.log(response.body,response.body.length);
         if (res.body.length < 1) {
             console.log(`No upcoming events found for ${artistName}.`);
         }
         else {
             console.log("\nUpcoming Concerts:")
             for (let i = 0; i < res.body.length; i++) {
                 let lat=parseFloat(res.body[i].venue.latitude).toFixed(4);
                 let long=parseFloat(res.body[i].venue.longitude).toFixed(4);

                 console.log(`Venue: ${res.body[i].venue.name} \nCoordinates: ${lat},${long}\n`);
             }
         }
        //  console.log(artistName);
     });
}

// Search spotify for song and display Artist, Song Name, Containing Album, & Preview link from Spotify
//If no song is provided then program will default to "What's My Age Again" by blink-182.
function searchSpotify(){
    const keys=require("./assets/keys.js");
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    // console.log(keys.spotify);
    let trackID='5JZcX7TTLx4l0xFIXJ3DBt';

    // Searches based on type/name
    // spotify.search({ type: 'track', query: "What's My Age Again", limit:1 }, function(err, data) {
    //     if (err) {
    //       return console.log('Error occurred: ' + err);
    //     }
       
    //   console.log(data);
    //   console.log("\nITEMS[0]: "+JSON.stringify(data.tracks.items[0]));
    //   });

    // Requests based on trackID
    spotify
  .request(`https://api.spotify.com/v1/tracks/${trackID}`)
  .then(function(data) {
    console.log(data); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });

}

// Output movie title, year released, IMDB rating, Rotten Tomatoes rating, country produced in, movie language, plot, and cast
// If user inputs nothing, output data for Mr. Nobody
function getMovieInfo(){

}

// LIRI uses input from text contained in random.txt
function doWhatItSays(){

}

function doThis(command) {
    switch (command) {
        case "concert-this":
            // console.log(command);
           upcomingConcerts();

            break;
        case "spotify-this-song":
            // console.log(command);
            searchSpotify();
            break;
        case "movie-this":
            // console.log(command);
            getMovieInfo();
            break;
        case "do-what-it-says":
            // console.log(command);
            doWhatItSays();
            break;
        default:
            console.log("You entered an invalid command.");
            break;
    }
}

doThis(userCommand);