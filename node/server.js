/**
 * indicsearch
 */
var express = require('express'), fs = require('fs'), restler = require('restler'), ui = require('./lib/ui.js'), crawl = require('./lib/crawl.js'), process = require('./lib/process.js'), db = require('./lib/search.js'), inspect = require('inspect'), argv = require('optimist').argv;

var app = express.createServer();
var config = JSON.parse(fs.readFileSync('./config.json').toString());
/**
 * GETS
 */ 
app.get('/', function(req,res){
     if(req.query){
	db.indicsearch.find({word:decodeURIComponent(req.query.q)}, function(er,rows){
	    res.render('index',{locals:{searchResultList:rows,posted:1}});
	});
    }else{
	res.render('index',{locals:{posted:0}});
    }
//	res.render('index',{locals:{posted:0,searchResultList:[]}});	
});

app.get('/search/:query', function(req,res){
    console.log('going to search for ', req.params);
    inspect(req.params);
    db.indicsearch.find({word:req.params.query}, function(er,rows){
	res.send(rows);
    });
});

app.post('/', function(req,res){
    console.log('going to search for ', req.body);
     if(req.body.q){
	db.indicsearch.find({word:decodeURIComponent(req.body.q)}, function(er,rows){
	    res.render('results',{locals:rows});
	});
    }else{
	res.render('index');
    }
});
app.get('/',function(req,res){
   
});

/**
 * POSTS
 */ 

appconfigure = function(_app){
    _app.configure(function(){
	_app.use(express.bodyParser());
	console.log('using body parser');
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

if(argv.crawl){
    crawl.begin('./sitemaps.txt');
}
