define([
	'backbone'
], function(Backbone) {
    
	var StateManager = Backbone.Model.extend({
		defaults: {
            currentTurnCharacter: null
		}
        
	});
	
	return new StateManager();
});