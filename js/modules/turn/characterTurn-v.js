define([
	'backbone',
    'modules/constants'
], function(
    Backbone, 
    constants
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
        
        onAttack: function() {
            this.model.set('characterTurnPrimaryAction', constants.characterTurn.primaryAction.ATTACK);
        },
        
		onEndTurn: function() {
            this.model.set('characterTurnPrimaryAction', constants.characterTurn.primaryAction.END_TURN);
		},
        
        onMove: function() {
            this.model.set('characterTurnPrimaryAction', constants.characterTurn.primaryAction.MOVE);
        },
        
        onTactic: function() {
            this.model.set('characterTurnPrimaryAction', constants.characterTurn.primaryAction.TACTIC);
        },
        
        onWait: function() {
            this.model.set('characterTurnPrimaryAction', constants.characterTurn.primaryAction.WAIT);
        }
        
	});
	
	return CharacterTurnView;
});