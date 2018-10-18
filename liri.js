require('dotenv').config();
const fs=require('fs');
const request=require("request");
let userCommand=process.argv[2];
const keys=require("./assets/keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
//capitalizes the first character of a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Updates the log.txt file
function updateLog(str){
    fs.appendFile("log.txt",str,function(error){
        if(error){
            return console.log(error);
        }
        // console.log("log.txt was created.\n");
    });
}

// checks BandsInTown for upcoming concerts and displays venue name and location
function upcomingConcerts(artist){
    const lastLog="";
     request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, res, body) {
         if (error) {
             console.log('error:', error); // Print the error if one occurred
             return;
         }
        //  console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
         // console.log('body:', body); // Print the HTML for the Google homepage.
         res.body = JSON.parse(res.body);
        //  console.log(res.body);
         if (res.body.length < 1) {
             let output=`\nNo upcoming events found for that artist.`;
             console.log(output);
             updateLog(output);
             
         }
         else {
             let fullOut="";
             console.log("\nUpcoming Concerts:");
             updateLog("\nUpcoming Concerts:");
             for (let i = 0; i < res.body.length; i++) {
                 let lat=parseFloat(res.body[i].venue.latitude).toFixed(4);
                 let long=parseFloat(res.body[i].venue.longitude).toFixed(4);
                if(res.body[i].venue.region!==""){
                    let output=`Venue: ${res.body[i].venue.name} in ${res.body[i].venue.city}, ${res.body[i].venue.region}, ${res.body[i].venue.country} \nCoordinates: ${lat},${long}`;
                    console.log(output);
                    fullOut+=`\n${output}`;
                }
                else{
                    let output=`Venue: ${res.body[i].venue.name} in ${res.body[i].venue.city}, ${res.body[i].venue.country} \nCoordinates: ${lat},${long}`;
                    console.log(output);
                    fullOut+=`\n${output}`;
                }
                if(i<res.body.length-1){
                    let output="--------------------------------------------------------------";
                    console.log(output);
                    fullOut+=`\n${output}`;
                }
             }
             fullOut+="\n\n***End of search result.***";
             updateLog(fullOut);
         }
        //  console.log(artistName);
     });
}

// when given a song title, finds the track ID
function searchSpotify(songTitle){
    // console.log(keys.spotify);
    // Searches based on type/name
    spotify.search({ type: 'track', query: songTitle, limit:1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
    //   console.log(data);
    //   console.log("\nITEMS[0].album: "+JSON.stringify(data.tracks.items[0].id));
      trackID=data.tracks.items[0].id;
    //   console.log(trackID);
      spotifyById(trackID);
      });


    
}
// Search spotify for song and display Artist, Song Name, Containing Album, & Preview link from Spotify
//If no song is provided then program will default to "What's My Age Again" by blink-182.
function spotifyById(trackID){
    const lastLog="";
    // console.log(trackID);
    if(trackID===undefined){
        trackID='5JZcX7TTLx4l0xFIXJ3DBt';
    }
    
    // Requests based on trackID
    spotify
        .request(`https://api.spotify.com/v1/tracks/${trackID}`)
        .then(function(data) {
            // console.log(data); 
            console.log(`Track: ${data.name}`)
            console.log(`by: ${data.artists[0].name.capitalize()}`)
            console.log(`Album: ${data.album.name}`);
            console.log(`Listen here: ${data.external_urls.spotify}`);
            
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
}

// Output movie title, year released, IMDB rating, Rotten Tomatoes rating, country produced in, movie language, plot, and cast
// If user inputs nothing, output data for Mr. Nobody
function getMovieInfo(movieTitle) {
    const lastLog="";
    if(movieTitle===undefined){
        movieTitle="Mr.+Nobody";
    }
    request(`http://www.omdbapi.com/?t=${movieTitle}&apikey=edcf067b`, function (error, res,body) {
        if (error) {
            console.log(error);
            // return;
        }
        console.log('statusCode:', res && res.statusCode);
        res.body = JSON.parse(res.body);
        // console.log(res.body,typeof(res.body));
        console.log(`\nTitle: ${res.body.Title}`);
        console.log(`Released in: ${res.body.Year}`);
        console.log(`Rated ${res.body.Ratings[0].Value} on ${res.body.Ratings[0].Source} and ${res.body.Ratings[1].Value} on ${res.body.Ratings[1].Source}.`);
        console.log(`Produced in: ${res.body.Country}`);
        console.log(`Language: ${res.body.Language}`);
        console.log(`Plot: ${res.body.Plot}`);
        console.log(`Cast: ${res.body.Actors}`);

        // // Get response data for combing
        //fs.writeFile("getMovie.txt",JSON.stringify(res.body),function(err){
        //     if (err) {
        //         return console.log(err);
        //       }
            
        //       console.log('getMovie.txt was updated!');
        // })
    })
}

// LIRI uses input from text contained in random.txt
function doWhatItSays(){
    const lastLog="";
    fs.readFile("./assets/random.txt","utf8",function(error,data){
        if(error){
            return console.log(error);
        }
        // console.log(data);
        let dataList=data.split(",");
        // console.log(dataList);
        dataList[1]=dataList[1].substr(1).slice(0,-1);
        // console.log(dataList);
        let myCommand=dataList[0];
        // console.log("Command: "+myCommand);
        let remainingData=dataList[1];
        // console.log("Remaining: "+remainingData);
        doThis(myCommand,remainingData);
    })
}

function doThis(command,extraData) {
    switch (command) {
        case "concert-this":
            // console.log(command);
            if (extraData) {
                let artist = "";
                let dataArr = extraData.split(" ");
                for (let i = 0; i < dataArr.length; i++) {
                    artist += dataArr[i];
                }
                upcomingConcerts(artist);
            }
            else if (!process.argv[3]) {
                updateLog("User typed 'concert-this' but did not enter an artist.")
                console.log("You didn't enter an artist.");
            }
            else {
                // let artist="avengedsevenfold";
                let artist = "";
                let artistName = "";
                for (let i = 3; i < process.argv.length; i++) {
                    artist += process.argv[i];
                    artistName += process.argv[i].capitalize() + " ";
                }
                artistName = artistName.slice(0, -1);
                //  console.log(artist,artistName,typeof(artistName));
                updateLog(`\nUser input: "${command} ${artistName}"`);
                upcomingConcerts(artist);
            }
            break;

        case "spotify-this-song":
            // console.log(command, process.argv[3]);
            if (extraData){
                // console.log(extraData);
                searchSpotify(extraData);
            }
            else if(process.argv[3]) {
                let songTitle = "";
                for (let i = 3; i < process.argv.length; i++) {
                    songTitle += process.argv[i] + " ";
                }
                    songTitle=songTitle.slice(0,-1);
                    // console.log(songTitle);
                    updateLog(`\nUser input: "${command} ${songTitle}"`);
                    searchSpotify(songTitle);
            }
            else {
                spotifyById(undefined);
            }
            break;

        case "movie-this":
            // console.log(command);
            let movie = "";
            if (extraData){
                let dataArr=extraData.split(" ");
                // console.log(dataArr);
                for(let i =0;i<dataArr.length;i++){
                    movie+=dataArr[i]+"+";
                }
                movie=movie.slice(0,-1);
                // console.log(movie);
                getMovieInfo(movie);
            }
            else if(process.argv[3]) {
                for (let i = 3; i < process.argv.length; i++) {
                    movie += process.argv[i] + "+";
                }
                movie = movie.slice(0, -1);
                // console.log(movie);
                updateLog(`\nUser input: "${command} ${movie}"`);
                getMovieInfo(movie);
            }
            else {
                getMovieInfo(undefined);
            }
            break;

        case "do-what-it-says":
            // console.log(command);
            updateLog(`\nUser input: "${command}"`);
            doWhatItSays();
            break;

        default:
            console.log("You entered an invalid command.");
            break;
    }
}

doThis(userCommand,undefined);
