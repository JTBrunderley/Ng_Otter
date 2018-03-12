const express = require('express');
const http = require('http');
const twit = require('twit');
const twitConfig = require("./twitConfig");

const app = express();
const router = express.Router();
const twitterService = new twit(twitConfig);

const port = process.env.PORT || 8080;

//app.use(express.static(__dirname + '/dist'));
app.use('/otter-api', router);
app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'dist/index.html'));
	});

app.listen(4201);



router.get('/tweets', function(req, res){
	var lat = req.query.lat;
	var lon = req.query.lon;
	var query = "geocode:" + lat + "," + lon + ",100mi -from:googuns_lulz -from:_grammar_ -jeff_steinport";
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	twitterService.get('search/tweets',{q: query, count: 12}, function(err, data, response){
		var tweets = [];
		if (data){
			for (var i = 0; i < data.statuses.length; i++){
				tweets.push({user: data.statuses[i].user.screen_name , tweet: data.statuses[i].text});
			}
			if (data.statuses.length == 0) {tweets.push({user:"OTTER_SYS", tweet: 'No New Tweets Located'});}
			res.json(tweets);
		} 
		if (err){ console.log(err) };
 });
});


const server = http.createServer(app);
server.listen(port, () => console.log('Server is now Running'));






