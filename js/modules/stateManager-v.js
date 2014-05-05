define([
	'jquery',
	'backbone',
	'modules/character-m',
    'modules/grid-m',
    'modules/stateManager-m'
], function($, Backbone, characters, grid, stateManager) {

	var StateManagerView = Backbone.View.extend({
		el: '#actionsMenu',
		
		initialize: function() {
			this.listenTo(stateManager, 'change:currentTurnCharacter', this.render);
			this.$endTurn = this.$('#endTurn');
		},
		
		render: function() {
            
		},
		
		events: {
			'click #endTurn': 'onEndTurn',
		},
		
		onEndTurn: function() {
			if(characters.indexOf(stateManager.get('currentTurnCharacter')) < characters.length - 1) {
                stateManager.set('currentTurnCharacter', characters.at(characters.indexOf(stateManager.get('currentTurnCharacter')) + 1));
            }
            else {
                stateManager.set('currentTurnCharacter', characters.at(0));
            }
            grid.set('selectedTile', stateManager.get('currentTurnCharacter').get('currentTile'));
		}

	});
	
	return new StateManagerView();
});