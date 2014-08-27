define([
	'backbone',
    'collections/character',
], function(
    Backbone,
    CharacterCollection
) {
    
	var MainMenuModel = Backbone.Model.extend({
		defaults: {
            savedCharacters: new CharacterCollection(),
            savedGames: Backbone.Collection.extend({})
		}

	});
	
	return MainMenuModel;
});