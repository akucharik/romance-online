define([
    'backbone',
    'jquery',
    'constants',
    'models/character',
    'models/home',
    'models/mainMenu',
    'views/mainMenu'
], function(
    Backbone,
    $,
    constants,
    CharacterModel,
    HomeModel,
    MainMenuModel,
    MainMenuView
) {
    
    var homeModel = new HomeModel();
    
    homeModel.get('savedCharacters').add([
        new CharacterModel({ name: 'Aaron' }),
        new CharacterModel({ name: 'Adam' }),
        new CharacterModel({ name: 'Chris' })
    ]);
        
    var HomeView = Backbone.View.extend({
        initialize: function () {
            this.listenTo(this.model, 'change:mode', this.render);
            this.render();
		},
        
        render: function () {

            switch (this.model.get('mode')) {
                case constants.home.mode.MAIN_MENU:
                    var mainMenuView = new MainMenuView({
                        className: 'main-menu-view',
                        id: 'mainMenuView',
                        model: homeModel,
                        parentEl: '#homeScreen',
                        template: '#mainMenuTemplate'
                    });
                    $('#homeScreen').append(mainMenuView.el);
                    break;
                
                case constants.home.mode.GAMES:
                    console.log('view saved games!');    
                    break;
                    
                case constants.home.mode.CHARACTERS:
                    console.log('view saved characters!');    
                    break;
            }
        }
    });
    
    var homeView = new HomeView({
        el: '#homeScreen',
        model: homeModel
    });
    
    // TODO: remove exposed characters after development
    window.homeModel = homeModel;
    window.homeView = homeView;
        
});