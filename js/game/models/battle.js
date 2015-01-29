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
            characterTurnMovementNodes: new Backbone.Collection,
            characterTurnMovementTiles: new Backbone.Collection,
            characterTurnPath: [],
            characterTurnPathNodes: new Backbone.Collection,
            characterTurnPathTiles: new Backbone.Collection,
            characterTurnPrimaryAction: null,
            characterTurnAttackNodes: new Backbone.Collection,
            characterTurnAttackTiles: new Backbone.Collection,
            
            // tiles
            focusedTile: new TileModel(),
            selectedTile: new TileModel()
		},
        
        // TODO: put this in the view, NOT the model
        resetCharacterTurn: function () {
            this.set('characterTurnPrimaryAction', null);
            this.get('characterTurnMovementNodes').reset();
        }
        
	});
	
	return BattleModel;
});