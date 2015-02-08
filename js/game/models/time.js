define([
	'backbone'
], function(
    Backbone
) {

    var TimeModel = Backbone.Model.extend({
        
        defaults: {
            // Frame time
            frameTime: Date.now() / 1000,
            frameTimeDelta: 0,
            
            // Game time
            gameTime: 0
        }
        
    });
        
    return TimeModel;

});