define([
    'backbone',
    'jquery',
    'constants',
    'models/character',
    'models/home',
    'views/home'
], function(
    Backbone,
    $,
    constants,
    CharacterModel,
    HomeModel,
    HomeView
) {
    
    var homeModel = new HomeModel();
    
    homeModel.get('savedCharacters').add([
        new CharacterModel({ name: 'Aaron', strength: 81, intelligence: 92 }),
        new CharacterModel({ name: 'Chris', strength: 80, intelligence: 91 }),
        new CharacterModel({ name: 'Adam', strength: 82, intelligence: 90 })
    ]);
    
    var homeView = new HomeView({
        el: '#activeView',
        model: homeModel
    });
    
    // TODO: remove exposed characters after development
    window.homeModel = homeModel;
    window.homeView = homeView;
        
});