define([
	'backbone',
    'constants',
    'collections/character',
    'models/character'
], function(
    Backbone,
    constants,
    CharacterCollection,
    CharacterModel
) {
    
	var HomeModel = Backbone.Model.extend({
		defaults: {
            state: constants.home.state.MAIN_MENU,
            savedCharacters: new CharacterCollection([], {
                model: CharacterModel,
                comparator: 'name'
            }),
            savedGames: Backbone.Collection.extend({})
		}

	});
	
	return HomeModel;
});