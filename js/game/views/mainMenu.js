define([
	'backbone',
    'jquery',
    'views/characterList'
], function(
    Backbone,
    $,
    CharacterListView
) {

	var MainMenuView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.template = _.template($(this.options.template).html());
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$continueGame = $('#continueGame');
            this.$editCharacter = $('#editCharacter');
            
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
            this.characterListView = new CharacterListView({
                el: '#characterList',
                model: this.model
            });
        },
        
        newCharacter: function () {
            console.log('new character');
        }
        
	});
	
	return MainMenuView;
});