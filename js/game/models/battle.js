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
            focusedTileGridCoordinates: null,
            selectedTile: null,
		},
        
        // TODO: put this in the view, NOT the model
        resetCharacterTurn: function () {
            this.set('characterTurnPrimaryAction', null);
            this.set('characterTurnMovementRange', null);
        }
        
	});
	
	return BattleModel;
});