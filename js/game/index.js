define([
    'backbone',
    'jquery',
    'models/character',
    'models/mainMenu',
    'views/mainMenu'
], function(
    Backbone,
    $,
    Character,
    MainMenuModel,
    MainMenuView
) {
    
    var mainMenuModel = new MainMenuModel();
    
    mainMenuModel.get('savedCharacters').add([
        new Character({ name: 'Aaron' }),
        new Character({ name: 'Adam' }),
        new Character({ name: 'Chris' })
    ]);
        
    var mainMenuView = new MainMenuView({
        className: 'menu',
        id: 'mainMenu',
        model: mainMenuModel,
        parentEl: '#homeScreen',
        tagName: 'ul',
        template: '#mainMenuTemplate'
    });
    
    $('#homeScreen').append(mainMenuView.el);
    
    // TODO: remove exposed characters after development
    window.characters = mainMenuModel.get('savedCharacters');
        
});