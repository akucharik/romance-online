define([
	'backbone',
    'collections/character',
], function(
    Backbone,
    CharacterCollection
) {
    // TODO: THIS ENTIRE MODEL IS NO LONGER USED AND CAN BE DELETED
	var MainMenuModel = Backbone.Model.extend({
		defaults: {
            mode: 'Main', // Main, Characters, Games
            savedCharacters: new CharacterCollection(),
            savedGames: Backbone.Collection.extend({})
		}

	});
	
	return MainMenuModel;
});