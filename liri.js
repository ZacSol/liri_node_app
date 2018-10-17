require('dotenv').config();
const request=require("request");
const keys=require("./assets/keys.js");
// const spotify = new Spotify(keys.spotify);
let userCommand=process.argv[2];

// checks BandsInTown for upcoming concerts and displays venue name and location
function upcomingConcerts(){
     // let artist="avengedsevenfold";
     let artist = "";
     for (let i = 3; i < process.argv.length; i++) {
         artist += process.argv[i];
     }
     // console.log(artist);
     request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, res, body) {
         if (error) {
             console.log('error:', error); // Print the error if one occurred
         }
         console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
         // console.log('body:', body); // Print the HTML for the Google homepage.
         res.body = JSON.parse(res.body);
         // console.log(response.body,response.body.length);
         if (res.body.length < 1) {
             console.log(`No upcoming events found for ${artist}.`);
         }
         else {
             for (let i = 0; i < res.body.length; i++) {
                 console.log(`Venue: ${res.body[i].venue.name} \nLocation: ${res.body[i].venue.latitude},${res.body[i].venue.longitude}\n`);
             }
         }
     });
}

// Search spotify for song and display Artist, Song Name, Containing Album, &Preview link from Spotify
//If no song is provided then program will default to "What's My Age Again" by blink-182.
function searchForSong(){

}

function doThis(command) {
    switch (command) {
        case "concert-this":
            // console.log(command);
           upcomingConcerts();

            break;
        case "spotify-song":
            // console.log(command);
            searchForSong();
            break;
        case "movie-this":
            // console.log(command);

            break;
        case "do-what-it-says":
            // console.log(command);

            break;
        default:
            console.log("You entered an invalid command.");
            break;
    }
}

doThis(userCommand);