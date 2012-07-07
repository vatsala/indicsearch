var mongo = require('mongodb-wrapper')
var db = mongo.db('192.168.1.17', 27017, 'test')
db.collection('indicsearch');

var find = function(query, _callback){
    console.log('find ', arguments);
    db.indicsearch.find(query).toArray(_callback);
};

var _indicsearch = module.exports.indicsearch = {
    find: find
};
