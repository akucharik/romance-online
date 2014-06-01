define([
	'jquery',
	'backbone',
	'modules/character-m',
    'modules/constants',
    'modules/pathfinder'
], function(
    $, 
    Backbone, 
    characters,
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
            this.clearMovementRange();
        },
        
		onEndTurn: function() {
			this.clearMovementRange();
            
            if(this.model.get('characters').indexOf(this.model.get('currentTurnCharacter')) < this.model.get('characters').length - 1) {
                this.model.set('currentTurnCharacter', this.model.get('characters').at(this.model.get('characters').indexOf(this.model.get('currentTurnCharacter')) + 1));
            }
            else {
                this.model.set('currentTurnCharacter', this.model.get('characters').at(0));
            }
            
		},
        
        onMove: function() {
            this.model.set('characterMovementRange', pathfinder.findRange(this.model.get('currentTurnCharacter')));
        },
        
        onTactic: function() {
            this.clearMovementRange();
        },
        
        onWait: function() {
            this.clearMovementRange();
        }
        
	});
	
	return CharacterTurnView;
});