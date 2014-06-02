define([
	'jquery',
	'backbone',
    'modules/constants',
    'modules/pathfinder'
], function(
    $, 
    Backbone, 
    constants,
    pathfinder
) {

	var CharacterTurnView = Backbone.View.extend({
		
		initialize: function() {
			
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
            this.model.set('characterMovementRange', constants.stateManager.characterMovementRange.empty)
        },
        
        onAttack: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.attack);
            this.clearMovementRange();
        },
        
		onEndTurn: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.endTurn);
			this.clearMovementRange();
            
            if(this.model.get('characters').indexOf(this.model.get('turnCharacter')) < this.model.get('characters').length - 1) {
                this.model.set('turnCharacter', this.model.get('characters').at(this.model.get('characters').indexOf(this.model.get('turnCharacter')) + 1));
            }
            else {
                this.model.set('turnCharacter', this.model.get('characters').at(0));
            }
            
		},
        
        onMove: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.move);
            this.model.set('characterMovementRange', pathfinder.findRange(this.model.get('turnCharacter')));
        },
        
        onTactic: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.tactic);
            this.clearMovementRange();
        },
        
        onWait: function() {
            this.model.set('turnAction', constants.stateManager.turnAction.wait);
            this.clearMovementRange();
        }
        
	});
	
	return CharacterTurnView;
});