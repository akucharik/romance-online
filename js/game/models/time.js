define([
	'backbone'
], function(
    Backbone
) {

    var TimeModel = Backbone.Model.extend({
        
        defaults: {
            // Frame time
            frameTime: Date.now() / 1000,
            elapsedFrameTime: 0,
            
            // Game time
            elapsedGameTime: 0,
            
            // Pause time
            pauseTime: 0,
            pauseDuration: 0,
            
            // States
            paused: false
        }
        
    });
        
    return TimeModel;

});