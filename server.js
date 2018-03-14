const express = require('express');
const http = require('http');
const twit = require('twit');
const twitConfig = require("./twitConfig");
const request = require('request');
const app = express();
const router = express.Router();
const twitterService = new twit(twitConfig);

const port = process.env.PORT || 8080;

app.use('/otter-api', router);
app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'dist/index.html'));
	});

app.listen(8080);

var tweets = [];
var place = "";
var lat = 0;
var lon = 0;
var init = 0;

updateIss();

setInterval(updateIss, 1 * 1000);
// setInterval(updatePlace, 10 * 1000);
setInterval(updateTweets, 10 * 1000);

function updateIss(){
	
	 request('https://api.wheretheiss.at/v1/satellites/25544', { json: true }, (err, res, body) => {
		 if(err){console.log(1,err);}
		 if(body){
			 lat = body.latitude;
			 lon = body.longitude;
			 
			 if(init == 0){
// 				 updatePlace();
				 updateTweets();
				 init = 1;
			 }
		 }
	 });
}

// function updatePlace(){
	
// 	 request('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json', { json: true }, (err, res, body) => {
// 		 if(err){console.log(2,err);}
// 		 if(body){
// 			 if (body.error) {
// 			        place = 'Over The Ocean';
// 			      } else if (body.display_name) {
// 			        place = body.display_name;
// 			      }
// 		 }
// 	 });
// }

function updateTweets(){
	
	var query = "geocode:" + lat + "," + lon + ",100mi -from:googuns_lulz -from:_grammar_ -jeff_steinport";
	twitterService.get('search/tweets',{q: query, count: 12}, function(err, data, response){
		var newtweets = [];
		if (data){
			for (var i = 0; i < data.statuses.length; i++){
				newtweets.push({user: data.statuses[i].user.screen_name , tweet: data.statuses[i].text});
			}
			if (data.statuses.length == 0) {newtweets.push({user:"OTTER_SYS", tweet: 'No New Tweets Located'});}
			tweets = newtweets;
		} 
		if (err){ console.log(3,err) };
 });
	
}

// router.get('/display', function(req, res){
  
// 	let displayObj = {place: place, tweets: tweets};
// 	res.json(displayObj);

// });

// router.get('/position', function(req, res){
	  
// 	let posObj = {latitude: lat, longitude: lon};
// 	res.json(posObj);

// });



const server = http.createServer(app);
server.listen(port, () => console.log('Server is now Running'));






