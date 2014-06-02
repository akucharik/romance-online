define([
	'backbone'
], function(
    Backbone
) {
    
	var StateManager = Backbone.Model.extend({
		defaults: {
            characterMovementRange: null,
            characters: null,
            turnAction: null,
            turnCharacter: null
		}
        
	});
	
	return StateManager;
});