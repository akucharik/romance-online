define([
	'backbone'
], function(
    Backbone
) {
    
	var BattleModel = Backbone.Model.extend({
		defaults: {
            // characters
            characters: null,
            //charactersForceA: null,
            //charactersForceB: null,
            
            // character turn
            characterTurnCharacter: null,
            characterTurnMovementRange: null,
            characterTurnPath: [],
            characterTurnPrimaryAction: null,
            characterTurnAttackRange: null,
            
            // tiles
            focusedTile: null,
            selectedTile: null
		},
        
        resetCharacterTurn: function () {
            this.set('characterTurnPrimaryAction', null);
            this.set('characterTurnMovementRange', null);
        }
        
	});
	
	return BattleModel;
});