define([
	'backbone',
    'modules/character-m'
], function(
    Backbone,
    characters
) {
    
	var StateManager = Backbone.Model.extend({
		defaults: {
            characterMovementRange: null,
            characters: characters,
            currentTurnCharacter: null
		}
        
	});
	
	return StateManager;
});