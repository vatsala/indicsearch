var fs = require('fs'),
sys = require('util'),
rest = require('restler'),
_ = require('underscore'),
inspect = require('inspect'),
apricot = require('apricot').Apricot,
stringHelper = require('./stringHelper');
var db = require('./search');
var write = module.exports.write = function(req,res){
    fs.writeFile('./text', req.params.text, function(er, text){ 
	console.log('wrote file', text);
	res.send({ok:1})
    });
};

var begin = module.exports.begin = function(_sitemap){
    var links = JSON.parse( fs.readFileSync(_sitemap).toString() );
    loop(links);
};

var loop = function(links){
    var _cb = arguments.callee;
    
    if(!links.length){
	process();return;
    }
    
    var link = links.shift();
    
    read(link.url, function(er, result){
	if(!er){

	    
	    var r = new RegExp("(<title>)([^<]+)(</title>)")
	    r.exec(result);
	    var _title = RegExp.$2;
	    if(_title){
		console.log(link.url,' has ', _title);	
		save(_title,link.url, link.name, function(){
		    console.log('finished reading ',link);
		    _cb(links);
		});
	    }


	    
	    /*   apricot.parse(result, function(err,doc) {
		fs.writeFileSync('./'+link.name, doc.innerHTML);
		console.log('apricot err: ', err,' doc: ', doc.find('title').innerHTML);
		var x = doc.find("title");
		console.log('x is ',doc.innerHTML);
	    });
	   */ /*
	    apricot.parse(result, function(er,doc){
		console.log(link.url,' got ', inspect(doc.find("title")));
		console.log('finished reading ',link);
		_cb(links);
	    });
	    */
	   
	}
    });
    
};

var save = function(_str,_url,_name,_callback){
    stringHelper.sentenceToWords(_str, function(er,_words){
	_.map(_words, function(_word){
	    var _row = {title:_str, word:_word, url: _url, name:_name, debug:1};
	    db.indicsearch.save(_row);
	    _callback();
	});
    });
    
};

var process = function(){
    console.log('start processing...');
};


var read = module.exports.read = function(url, _callback){
    // Link Which is in_parameter : ex :- http://www.guimp.com
    rest.get(url).on('complete', function(result){

	console.log(result.length,' has title: ', result.indexOf('title'));
	if( result instanceof Error){
            sys.puts('Error :' + result.message);
            //this.retry(5000);
            console.log("Wait...");
	    _callback({error: result});
        }
	_callback(null,result);
    });
};
/*
,
{"url":"http://thatshindi.com", "name":""},
{"url":"http://aajtak.intoday.in", "name":""}
*/
