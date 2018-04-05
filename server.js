const express = require('express');
const http = require('http');
const twit = require('twit');
const twitConfig = require("./twitConfig");
const request = require('request');
const app = express();
const router = express.Router();
const twitterService = new twit(twitConfig);
const googleConfig = require("./googleConfig");
const googleMapsClient = require('@google/maps').createClient(googleConfig);
const port = process.env.PORT || 8080;

app.use('/otter-api', router);
app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'dist/index.html'));
	});

var tweets = [];
var place;
var lat;
var lon;
var init = 0;
var error;

updateIss();

setInterval(updateIss, 1 * 1000);
setInterval(updatePlace, 12 * 1000);
setInterval(updateTweets, 12 * 1000);

function updateIss(){

	 request('https://api.wheretheiss.at/v1/satellites/25544', { json: true }, (err, res, body) => {
		 if(err){console.log(err);}
		 if(body){
			 lat = body.latitude;
			 lon = body.longitude;

			 if(init == 0){
				 updatePlace();
				 updateTweets();
				 init = 1;
			 }
		 }
	 });
}

function updatePlace(){

	    googleMapsClient.reverseGeocode({
      latlng: lat + "," + lon,
      result_type: "administrative_area_level_1"
      }, function(err, response) {
        if (err){error = err;}
        if (response.json.results.length > 0){
					place = response.json.results[0].formatted_address;
          error = null;

        } else {
          place = lat.toFixed(3) + ", " + lon.toFixed(3);
          error = null;
        }
      });
}

function updateTweets(){

	var query = "geocode:" + lat + "," + lon + ",100mi -from:googuns_lulz -from:_grammar_ -from:jeff_steinport -from:donkaare";
	twitterService.get('search/tweets',{q: query, count: 12}, function(err, data, response){
		var newtweets = [];
		if (data){
			for (var i = 0; i < data.statuses.length; i++){
				newtweets.push({user: data.statuses[i].user.screen_name , tweet: data.statuses[i].text});
			}
			if (data.statuses.length == 0) {newtweets.push({user:"OTTER_SYS", tweet: 'Quiet on the Surface'});}
			tweets = newtweets;
		}
		if (err){ console.log(3,err) };
 });

}

router.get('/display', function(req, res){

	let displayObj = {place: place, tweets: tweets, err: error};
  res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.json(displayObj);

});

router.get('/position', function(req, res){

	let posObj = {latitude: lat, longitude: lon};
  res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.json(posObj);

});

const server = http.createServer(app);
server.listen(port, () => console.log('Server is now Running'));
