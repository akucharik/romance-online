define([
	'backbone',
    'models/tile'
], function(
    Backbone,
    TileModel
) {
    
	var BattleModel = Backbone.Model.extend({
		defaults: {
            // characters
            characters: null,
            //charactersForceA: null,
            //charactersForceB: null,
            
            // character turn
            characterTurnCharacter: null,
            characterTurnMovementRange: new Backbone.Collection,
            characterTurnPath: [],
            characterTurnPrimaryAction: null,
            characterTurnAttackRange: null,
            
            // tiles
            focusedTile: new TileModel(),
            selectedTile: new TileModel()
		},
        
        // TODO: put this in the view, NOT the model
        resetCharacterTurn: function () {
            this.set('characterTurnPrimaryAction', null);
            this.get('characterTurnMovementRange').reset();
        }
        
	});
	
	return BattleModel;
});