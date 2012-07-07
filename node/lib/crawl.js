var fs = require('fs');
var write = module.exports.write = function(req,res){
	fs.writeFile('./text', req.params.text, function(er, text){ 
		console.log('wrote file', text);
		res.send({ok:1})
	});
};

var getData = module.exports.getData = function(req,res)
{
        var sys = require('util'),
        rest = require('./../node_modules/restler/');
	// Link Which is in_parameter : ex :- http://www.guimp.com
        rest.get('http://www.guimp.com/').on('complete', function(result)
        {
                if( result instanceof Error)
                {
                        sys.puts('Error :' + result.message);
                        this.retry(5000);
                        console.log("Wait...");
                }
                sys.puts(result);
        });
};
