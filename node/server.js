/**
 * indicsearch
 */
var express = require('express'), fs = require('fs'), restler = require('restler'), ui = require('./lib/ui.js'), crawl = require('./lib/crawl.js'), process = require('./lib/process.js');

var app = express.createServer();
var config = JSON.parse(fs.readFileSync('./config.json').toString());
app.get('/', function(req,res){

	res.send('hello, world');	

});

app.get('/json/write/:text',function(req,res){
	fs.writeFile('./text', req.params.text, function(){ 
		console.log('wrote file');
		res.send({ok:1})
	});
});

app.get('/json/readurl/:url', function(req,res){
	crawl.read(url, function(){
		//do something here
		ui.render(req,res);
	});
});

var _writeFile = function(_file,_contents,_callback){
	fs.writeFile('./text', _contents, _callback);
};

app.listen(config.port);
console.log("Server listening on http://localhost:'+config.port);
