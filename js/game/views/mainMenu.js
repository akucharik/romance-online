define([
	'backbone',
    'jquery',
    'views/characters',
    'views/characterList',
    'constants'
], function(
    Backbone,
    $,
    CharactersView,
    CharacterListView,
    constants
) {

	var MainMenuView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.parentEl = document.querySelector(this.options.parentEl);
            this.$parentEl = $(this.parentEl);
            this.template = _.template($(this.options.template).html());
            
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$continueGame = this.$el.find('#continueGame');
            this.$editCharacter = this.$el.find('#editCharacter');
            this.model.get('savedGames').length > 0 ? this.$continueGame.show() : this.$continueGame.hide();
            this.model.get('savedCharacters').length > 0 ? this.$editCharacter.show() : this.$editCharacter.hide();

            return this;
        },
        
        events: {
            'click #continueGame': 'continueGame',
            'click #newGame': 'newGame',
            'click #editCharacter': 'editCharacter',
            'click #newCharacter': 'newCharacter'
        },
        
        continueGame: function () {
            window.location.href = 'game.html';
        },
        
        newGame: function () {
            window.location.href = 'game.html';
        },
        
        editCharacter: function () {
            this.model.set('mode', constants.home.mode.CHARACTERS);
            
            this.charactersView = new CharactersView({
                className: 'characters-view',
                id: 'charactersView',
                model: this.model,
                template: '#charactersTemplate'
            });
            
            this.$parentEl.append(this.charactersView.el);

            this.remove();
        },
        
        newCharacter: function () {
            console.log('new character');
        }
        
	});
	
	return MainMenuView;
});