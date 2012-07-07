/**
 * getmongo.js
 * @author Bhasker Kode
 * require('getmongo')(_init);
 **/
var fs = require("fs");
var util = require("util");
global._ = require('underscore');
global.log4js = require("log4js");
var argv = require('optimist').argv;
var colors = require('colors');
global.mongoUtils = require("./mongo-utils");
global.mongoExpressUtils = require("./mongo-express-utils");

module.exports = {
    init: function(appname,callback){
	global.appname = appname;
	
	log4js.addAppender(log4js.fileAppender('./getmongo_'+ appname+'.log'), appname);
	globallogger = log4js.getLogger(appname);
	
	/**
	 * Makes it easy to do things like server_mgr.js --debug=DEBUG while debugging
	 * and server_mgr.js --debug=WARN for live
	 */
	if(argv.debug){
	    globallogger.setLevel(argv.debug);
	}else{
	    globallogger.setLevel('DEBUG');
	}
	
	/*
	 * Loading configs.
	 */
	try {
	    var _path = (argv.db)?argv.db : process.cwd()+"/../config_http_"+appname+".json";
	    console.log('reading '+_path);
	    config = JSON.parse(fs.readFileSync(_path));
	    config.server.root = config.server.transport + config.server.hostname;
	    config.server.root += (config.server.port==80) ? '' : ':'+config.server.port;
	    global.globalconfig = config;     
	    globallogger.info("connecting to mongo "+ (config.db.hosts) ? config.db.hosts : config.db.host);
	} catch(e) {
	    globallogger.fatal("Could not load the config_http_"+appname +".json. Exiting." + e);
	    process.exit();
	}
	
	if(globalconfig.db){
	    var _hosts =(globalconfig.db.hosts) ? globalconfig.db.hosts : globalconfig.db.host;
	    var _auth = (globalconfig.db.hosts) ? mongoUtils.getAuthenticatedMongoDBAsReplicas : mongoUtils.getAuthenticatedMongoDB; 
	    _auth(_hosts,globalconfig.db.port,globalconfig.db.dbname,globalconfig.db.username,globalconfig.db.password,function (err,db){
		if (!err) {
		    global.globaldb = db;
		}
		callback(db);
	    });
	}else{
	    globallogger.fatal('no db in ', (process.cwd()+"/config_http_" + appname +".json") );
	}
    },
    distinct : function(collectionName,field,query,callback){
	mongoUtils.getCollection(globaldb,collectionName,function(err,collection){
	    if (!err) {
		mongoUtils.performDistinctOperation(collection,field,query,function(er,docs){ 
		    globallogger.debug('findDistinct:  gave ' + docs.length + ' '+ field+'s');
		    callback(er,docs);
		});
		
	    }else{
		callback(err,[]);
	    }
	});
    }
};
	    
