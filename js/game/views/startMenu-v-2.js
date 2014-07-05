define([
	'jquery',
	'backbone',
	'models/character-m'
], function($, Backbone, charactersModel) {

	var StartMenuView = Backbone.View.extend({
		el: '#start-menu',
		
		initialize: function() {
			this.listenTo(charactersModel, 'add remove reset', this.render);
			this.render();
		},
		
		render: function() {
			// Disable the 'Edit Character' action when there are no characters:
			this.$('[data-action="char-edit"]').prop('disabled', !charactersModel.length);
			
			// set visibility of the 'Load Game' action
			//this.loadGame.set('visible', false); // << Based on what?
			
			return this;
		},
		
		events: {
			'click [data-action="game-load"]': 'onLoadGame',
			'click [data-action="game-new"]': 'onNewGame',
			'click [data-action="char-new"]': 'onNewChar',
			'click [data-action="char-edit"]': 'onEditChar'
		},
		
		onLoadGame: function() {
			console.log("Load Game");
		},
		
		onNewGame: function() {
			console.log("New Game");
		},
		
		onNewChar: function() {
			console.log("New Character");
		},
		
		onEditChar: function() {
			console.log("Edit Character");
		}
	});
	
	return new StartMenuView();
});