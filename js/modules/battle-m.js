define([
	'backbone'
], function(
    Backbone
) {
    
	var BattleModel = Backbone.Model.extend({
		defaults: {
            // characters
            characters: null,
            //charactersA: null,
            //charactersB: null,
            
            // character turn
            characterTurnPrimaryAction: null,
            characterTurnCharacter: null,
            characterTurnMovementRange: null,
            characterTurnPath: [],
            
            // tiles
            focusedTile: null,
            selectedTile: null
		}
        
	});
	
	return BattleModel;
});