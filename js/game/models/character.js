define([
	'backbone',
    'constants'
], function(
    Backbone,
    constants
) {
    
	var CharacterModel = Backbone.Model.extend({
		defaults: {
            // Basic
            name: 'Unknown',
            
            // Attributes
            attributePoints: 50,
            intelligence: 50,
            strength: 50,
            
            // Health
            health: 6890,
            maxHealth: 10000,
            
            // Skill values
            attackRange: 4,
            movementRange: 4,
            maxMovementRange: 4,
            
            // Combat
            target: null,
            
            // Position
            currentTile: null,
            path: null,
            velocity: 200,
            x: null,
            y: null,
            
            // Rendering
            spritesheet: document.getElementById('spritesheet'),
            spriteX: 0,
            spriteY: 0,
            spriteWidth: 0,
            spriteHeight: 0,
            time: null,
            
            // States
            isChangingHealth: false
		},
        
        initialize: function () {
            
        }

	});
	
	return CharacterModel;
});