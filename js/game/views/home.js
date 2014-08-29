define([
	'backbone',
    'jquery',
    'constants',
    'views/characters',
    'views/mainMenu'
], function(
    Backbone,
    $,
    constants,
    CharactersView,
    MainMenuView
) {

    var HomeView = Backbone.View.extend({
        initialize: function () {
            this.activeView = null;
            
            this.listenTo(this.model, 'change:state', this.render);
            this.render();
		},
        
        render: function () {
            if (this.activeView) {
                this.activeView.remove();
            }
            
            switch (this.model.get('state')) {
                case constants.home.state.MAIN_MENU:
                    this.activeView = new MainMenuView({
                        className: 'main-menu-view',
                        id: 'mainMenuView',
                        model: this.model,
                        tagName: 'div',
                        template: '#mainMenuTemplate'
                    });
                    break;
                
                case constants.home.state.GAMES:
                    console.log('view saved games!');    
                    break;
                    
                case constants.home.state.CHARACTERS:
                    this.activeView = new CharactersView({
                        className: 'characters-view',
                        id: 'charactersView',
                        model: this.model,
                        tagName: 'div',
                        template: '#charactersTemplate'
                    });
                    break;
            }
            
            this.$el.append(this.activeView.el);
        }
    });
        
	return HomeView;
});