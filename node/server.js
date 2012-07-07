/**
 * indicsearch
 */
var express = require('express'), fs = require('fs');
var app = express.createServer();
var config = JSON.parse(fs.readFileSync('./config.json').toString());
app.get('/', function(req,res){

	res.send('hello, world');	

});

app.get('/json/write/:text',function(req,res){
	fs.writeFile('./text', text, function(){ console.log('wrote file'); });
});

app.listen(config.port);
