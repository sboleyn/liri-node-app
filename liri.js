require("dotenv").config();

var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require('moment');

var keys = require('./keys')

var spotify = new Spotify(keys.spotify);

var argms = process.argv;
var action = argms[2];
var value = argms.splice(3).join(' ');

// spotify
//   .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
//   .then(function (data) {
//     console.log(data);
//   })
//   .catch(function (err) {
//     console.error('Error occurred: ' + err);
//   });


// ---------------------------
// FUNCTION 1
// ---------------------------

// `node liri.js concert-this <artist/band name here>`
if (action === "concert-this"){
  var url = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
  request(url, function(err, resp, body){
    if (!err && resp.statusCode === 200){
      var _body = JSON.parse(body);

      console.log("The artist/band "+ value + " has these upcoming events! (" + _body.length +")");

      var bandCount = 0;
      _body.forEach(function(band){
        bandCount += 1;
        var location = band.venue.city + "," +band.venue.region +' '+ band.venue.country;
        console.log("Event # " + bandCount);
        console.log('*-----------------------------------*');
        // console.log(band);
        // console.log(_body);
        // console.log("Event # " + bandCount);
        console.log("Venue Name: " + band.venue.name);
        console.log("Venue Location: " + location);
        console.log("Event Date: " + band.datetime);
        console.log('*-----------------------------------*\n');
      })
    }
  })
}

// "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
//      * Name of the venue
// * Venue location
// * Date of the Event (use moment to format this as "MM/DD/YYYY")



