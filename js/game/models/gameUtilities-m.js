define([
	'backbone'
], function(
    Backbone
) {

    var Time = Backbone.Model.extend({
        
        defaults: {
            averageFrameRate: 0,
            currentFrameRate: 0,
            currentFrameTime: Date.now(),
            deltaFrameTime: 0,
            gameTime: 0,
            previousFrameRates: [],
            previousFrameTime: Date.now()
        },
        
        initialize: function() {
			
		}
        
    });
        
    var GameUtilities = function () {
        this.time = new Time();
    };
        
    return GameUtilities;

});