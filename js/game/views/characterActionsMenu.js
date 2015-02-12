define([
	'backbone',
    'constants'
], function(
    Backbone, 
    constants
) {

	var CharacterActionsMenuView = Backbone.View.extend({
        
		initialize: function() {
            this.$elAttack = $('#attack');
            this.$elEndTurn = $('#endTurn');
            this.$elMove = $('#move');
            this.$elTactic = $('#tactic');
            this.$elWait = $('#wait');
            this.character = null;
            
            // TODO: 'characterTurnCharacter' currently is a numeric value and should be the character object
            this.listenTo(this.model, 'change:characterTurnCharacter', this.onTurnChange);
            this.render();
		},
		
		render: function() {
            // TODO: Once 'characterTurnCharacter' is fixed this can be uncommented
            //this.$elMove.prop('disabled', this.character.get('movementRange') > 0 ? false : true);
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
        },
        
        onTurnChange: function () {
            console.log('character changed');
            
            if (this.model.get('characterTurnCharacter') !== null) {
                // TODO: Once 'characterTurnCharacter' is fixed this can be uncommented
                //this.stopListening(this.character);
            }
            
            if (this.model.get('characterTurnCharacter') !== null) {
                this.character = this.model.get('characterTurnCharacter')
                console.log('character is now: ', this.character);
                // TODO: Once 'characterTurnCharacter' is fixed this can be uncommented
                //this.listenTo(this.character, 'change:movementRange', this.render);
            }
        }
        
	});
	
	return CharacterActionsMenuView;
});