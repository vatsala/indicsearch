var searchResult = Backbone.Model.extend({

});
var searchResultList = Backbone.Collection.extend({
model:searchResult,
});

var searchResultView = Backbone.View.extend({
init: function() {},
el:$("searchResultList"),
render:function() {
	var variables = { searchResultList : this.collection };
	var template = _.template($("searchResultListTemplate").html(),variables);
	this.$el.html(template);
	return this;
}
});

function appinit(query){
var searchResults = new searchResultList();
searchResults.url="/search/"+query;
searchResults.fetch({
success:
	function(){ new searchResultView({collection:searchResults}).render(); }
});

}
