// read function for sentence to word.
var sentenceToWords = module.exports.sentenceToWords = function(str, _callback)
{
	console.log('ask to split str', str);
	var result = str.split(' ');
	_callback(result);
}
