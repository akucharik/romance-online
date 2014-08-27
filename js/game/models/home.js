define([
	'backbone',
    'collections/character',
    'constants'
], function(
    Backbone,
    CharacterCollection,
    constants
) {
    
	var HomeModel = Backbone.Model.extend({
		defaults: {
            mode: constants.home.mode.MAIN_MENU,
            savedCharacters: new CharacterCollection(),
            savedGames: Backbone.Collection.extend({})
		}

	});
	
	return HomeModel;
});