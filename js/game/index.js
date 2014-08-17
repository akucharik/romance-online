define([
    'jquery',
    'collections/character',
    'models/mainMenu',
    'views/mainMenu'
], function(
    $,
    CharacterCollection,
    MainMenuModel,
    MainMenuView
) {
    
    var mainMenuModel = new MainMenuModel();
    var savedGames = Backbone.Collection.extend({
		
	});
    var savedCharacters = new CharacterCollection();
    mainMenuModel.set('savedGames', savedGames);
    mainMenuModel.set('savedCharacters', savedCharacters);

    var mainMenuView = new MainMenuView({
        el: '#mainMenu',
        model: mainMenuModel,
        continueGame: '#continueGame',
        editCharacter: '#editCharacter'
    });
});