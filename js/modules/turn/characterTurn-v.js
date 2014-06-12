define([
	'jquery',
	'backbone',
    'modules/constants'
], function(
    $, 
    Backbone, 
    constants
) {

	var CharacterTurnView = Backbone.View.extend({
        
		initialize: function(options) {
            this.pathfinder = options.pathfinder;
		},
		
		render: function() {
            
		},
		
		events: {
            'click #attack': 'onAttack',
            'click #endTurn': 'onEndTurn',
            'click #move': 'onMove',
            'click #tactic': 'onTactic',
            'click #wait': 'onWait'
		},
		
        clearMovementRange: function() {
            this.model.set('characterMovementRange', {})
        },
        
        onAttack: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.ATTACK);
            this.clearMovementRange();
        },
        
		onEndTurn: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.END_TURN);
			this.clearMovementRange();
            
            if(this.model.get('characters').indexOf(this.model.get('turnCharacter')) < this.model.get('characters').length - 1) {
                this.model.set('turnCharacter', this.model.get('characters').at(this.model.get('characters').indexOf(this.model.get('turnCharacter')) + 1));
            }
            else {
                this.model.set('turnCharacter', this.model.get('characters').at(0));
            }
            
		},
        
        onMove: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.MOVE);
            this.model.set('characterMovementRange', this.pathfinder.findPaths(this.model.get('turnCharacter')));
        },
        
        onTactic: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.TACTIC);
            this.clearMovementRange();
        },
        
        onWait: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.WAIT);
            this.clearMovementRange();
        }
        
	});
	
	return CharacterTurnView;
});