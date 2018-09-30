require("dotenv").config();

var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var keys = require('./keys')

var spotify = new Spotify(keys.spotify);

var argms = process.argv;
var action = argms[2];
var value = argms.splice(3).join(' ');

// ---------------------------
// FUNCTION 1
// ---------------------------

// `node liri.js concert-this <artist/band name here>`
if (action === "concert-this") {
  var url = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
  request(url, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var _body = JSON.parse(body);

      console.log("The artist/band " + value + " has these upcoming events! (" + _body.length + ")");

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

if (action === "spotify-this-song") {
  // value is a song
  // search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);

  // spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  //   if (err) {
  //     return console.log('Error occurred: ' + err);
  //   }

  // console.log(data); 
  // });

  spotify.search({ type: 'track', query: value, limit: 20 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    else {
      console.log("You've searched for the track: " + value);
      console.log(data.tracks.items[0]);
      // data.tracks.items.forEach(function(song){
   
         //   console.log(song);
      // })
    }
  })
}