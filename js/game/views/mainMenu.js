define([
	'backbone',
    'jquery'
], function(
    Backbone,
    $
) {

	var MainMenuView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$continueGame = $(this.options.continueGame);
            this.$editCharacter = $(this.options.editCharacter);
            
            this.model.get('savedGames').length > 0 ? this.$continueGame.show() : this.$continueGame.hide();
            this.model.get('savedCharacters').length > 0 ? this.$editCharacter.show() : this.$editCharacter.hide();

            return this;
        },
        
        template: _.template($('#mainMenuTemplate').html())
        
	});
	
	return MainMenuView;
});