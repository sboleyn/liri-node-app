require("dotenv").config();

var request = require('request');
var moment = require('moment');
var fs = require('fs');

var keys = require('./keys')

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var argms = process.argv;
var action = argms[2];
var value = argms.splice(3).join(' ');

// ---------------------------
// FUNCTION 1
// ---------------------------

// `node liri.js concert-this <artist/band name here>`
var handleConcert = function () {
  var url = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
  request(url, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var _body = JSON.parse(body);

      console.log("\nThe artist/band " + value + " has these upcoming events! (" + _body.length + ")");

      var bandCount = 0;
      _body.forEach(function (band) {
        bandCount += 1;

        var location = band.venue.city + ", " + band.venue.region + ' ' + band.venue.country;

        // var _date = moment(band.dateTime, 'YYYY-MM-DDHH:MM:SS').format('MM/DD/YYYY');

        console.log("Event # " + bandCount);
        console.log('*-----------------------------------*');
        // console.log(band);
        // console.log(_body);
        // console.log("Event # " + bandCount);
        console.log("Venue Name: " + band.venue.name);
        console.log("Venue Location: " + location);
        // console.log("Event Date: " + _date);
        console.log("Event Date: " + moment(band.datetime).format('MM/DD/YYYY'));
        console.log('*-----------------------------------*\n');
      })
    }
  })

}

// ---------------------------
// FUNCTION 2
// ---------------------------

var handleSpot = function (err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  else {
    console.log("\nYou've searched for the track: " + value);
    console.log("We found " + data.tracks.items.length + " results!");
    // console.log(data.tracks.items[0]);
    var songCount = 0;

    data.tracks.items.forEach(function (song) {
      songCount += 1;

      console.log("Song # " + songCount);
      console.log('*-----------------------------------*');

      console.log("Artist(s): " + song.artists[0].name);
      console.log("Song name: " + song.name);
      console.log("Album: " + song.album.name);
      console.log("Preview song: " + song.preview_url);
      console.log("Link to Spotify track: " + song.external_urls.spotify);

      console.log('*-----------------------------------*\n');
    })
  }
}

var runSpot = function () {
  if (value) {
    spotify.search({ type: 'track', query: value, limit: 20 }, function (err, data) {
      handleSpot(err, data);
    })
  }
  else {
    spotify.search({ type: 'track', query: "The Sign", limit: 20 }, function (err, data) {
      handleSpot(err, data);
    })
  }
};

// ---------------------------
// FUNCTION 3
// ---------------------------
var handleOMDB = function () {
  request("http://www.omdbapi.com/?apikey=trilogy&t=" + value, function (err, resp, data) {
    if (!err && resp.statusCode === 200) {
      var _body = JSON.parse(data);
      console.log(_body.Response === "True");
      if (_body.Response === "True") {
        // console.log(_body.Title);
        console.log(resp.statusCode);
        console.log("\nYou searched for " + value);
        console.log('*-----------------------------------*');
        console.log("Title of movie: " + _body.Title);
        console.log("Year: " + _body.Year);
        console.log("IMDB rating: " + _body.imdbRating);
        if (_body.Ratings[1]) {
          console.log("Rotten Tomatoes rating: " + _body.Ratings[1].Value)
        }
        else {
          console.log("Rotten Tomatoes rating: N/A");
        };
        console.log("Country: " + _body.Country);
        console.log("Language: " + _body.Language);
        console.log("Plot summary: " + _body.Plot);
        console.log("Actors: " + _body.Actors);
        console.log('*-----------------------------------*\n');
      }
    };
  })
};

// ---------------------------
// MAIN
// ---------------------------
if (action === "concert-this") {
  handleConcert();
}

else if (action === "spotify-this-song") {
  runSpot();
}

else if (action === "movie-this") {
  if (value) {
    handleOMDB();
  }
  else {
    value = "Mr. Nobody";
    handleOMDB();
  };
}

// ---------------------------
// FUNCTION 4
// ---------------------------

else if (action === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var datArr = data.split(",");

    action = datArr[0];

    if (datArr[1]){
    value = datArr[1];
    value = value.substring(1, value.length - 1);

    switch (action) {
      case "concert-this":
        handleConcert();
        break;

      case "spotify-this-song":
        runSpot();
        break;

      case "movie-this":
        handleOMDB();
        break;

    }
  }
  else{
    console.log("Hmmm, seems that the file may be missing something.")
  }
  })
}

else {
  console.log("I do not recognize this as an action. Please try again by selection 'concert-this', 'spotify-this-song', 'movies-this', or 'do-what-it-says'. \nHave a nice day.");
}