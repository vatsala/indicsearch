/**
 * indicsearch
 */
var express = require('express'), fs = require('fs'), restler = require('restler'), ui = require('./lib/ui.js'), crawl = require('./lib/crawl.js'), process = require('./lib/process.js'), db = require('./lib/search.js'), inspect = require('inspect');

var app = express.createServer();
var config = JSON.parse(fs.readFileSync('./config.json').toString());
/**
 * GETS
 */ 
app.get('/', function(req,res){
	res.render('index');	
});

app.get('/search/:query', function(req,res){
    console.log('going to search for ', req.params.query);
    inspect(db);
    db.indicsearch.find({word:req.params.query}, function(er,rows){
	res.send(rows);
    });
});

app.get('/q',function(req,res){
    if(req.query.q){
	db.indicsearch.find({word:decodeURIComponent(req.query.q)}, function(er,rows){
	    res.render('results',{locals:rows});
	});
    }else{
	res.render('index');
    }
});

/**
 * POSTS
 */ 

appconfigure = function(_app){
    _app.configure(function(){
	_app.use(express.bodyParser());
	_app.use(express.static(__dirname + '/public/'));
	//_app.use(log4js.connectLogger(globallogger, { level: log4js.levels.DEBUG }));
	_app.use(express.cookieParser());
	_app.set('views', __dirname + '/views/');
	_app.set('view engine', 'ejs');
	_app.set('view options', { 
	    layout: false
	}); 
    });
};

appconfigure(app);

app.listen(config.port);
console.log("Server listening on http://localhost:"+config.port);

crawl.begin('./sitemaps.txt');
