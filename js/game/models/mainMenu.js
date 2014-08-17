define([
	'backbone'
], function(
    Backbone
) {
    
	var MainMenuModel = Backbone.Model.extend({
		defaults: {
            savedCharacters: null,
            savedGames: null
		},
        
        initialize: function () {
            
        }

	});
	
	return MainMenuModel;
});