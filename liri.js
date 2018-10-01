require("dotenv").config();

var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var fs = require('fs');

var keys = require('./keys')

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

if (action === "concert-this") {
  handleConcert();
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

if (action === "spotify-this-song") {

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

if (action === "movie-this") {
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

if (action === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var datArr = data.split(",");
    // console.log(datArr);
    action = datArr[0];
    value = datArr[1];
    // value = input;

    // console.log(action);
    // console.log(value);
    // console.log(input);

    switch (action) {
      case "concert-this":
        // console.log("concert-this")
        value = value.substring(1, value.length - 1)
        handleConcert();
        break;

      case "spotify-this-song":
        // console.log("spotify-this-song");


        if (value) {
          value = value.substring(1, value.length - 1)
          spotify.search({ type: 'track', query: value, limit: 20 }, function (err, data) {
            handleSpot(err, data);
          })
        }
        else {
          spotify.search({ type: 'track', query: "The Sign", limit: 20 }, function (err, data) {
            handleSpot(err, data);
          })
        }


        break;

      case "movie-this":
        value = value.substring(1, value.length - 1)
        // console.log(value);
        // console.log("movie-this");
        handleOMDB();
        break;

    }

  })
};