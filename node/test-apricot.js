
var apricot = require('apricot').Apricot;
  
 Apricot.parse("<p id='test'>An HTML Fragment</p>", function(doc) {
		var x = doc.find("title");
		console.log('x is ',x);
	    });
