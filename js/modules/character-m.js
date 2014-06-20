define([
	'backbone',
    'modules/constants'
], function(
    Backbone,
    constants
) {
    
	var CharacterModel = Backbone.Model.extend({
		defaults: {
            intelligence: 50,
            strength: 50,
            availableAttributePoints: 50,
            currentTile: null,
            maxMovementRange: 4,
            movementRange: 4,
            spritesheet: document.getElementById('spritesheet'),
            spriteX: 0,
            spriteY: 0,
            velocity: 200,
            x: null,
            y: null
		},
        
        initialize: function () {
            
        }

	});
	
	return CharacterModel;
});