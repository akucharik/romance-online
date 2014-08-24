define([
    'jquery',
    'collections/character',
    'models/character',
    'models/mainMenu',
    'views/mainMenu',
    'views/characterList'
], function(
    $,
    CharacterCollection,
    Character,
    MainMenuModel,
    MainMenuView,
    CharacterListView
) {
    
    var mainMenuModel = new MainMenuModel();

    mainMenuModel.get('savedCharacters').add([
        new Character({ name: 'Aaron' }),
        new Character({ name: 'Adam' }),
        new Character({ name: 'Chris' })
    ]);
    
    // TODO: remove exposed characters after development
    window.characters = mainMenuModel.get('savedCharacters');
        
    var mainMenuView = new MainMenuView({
        el: '#mainMenu',
        model: mainMenuModel,
        template: '#mainMenuTemplate'
    });
        
});