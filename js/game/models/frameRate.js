define([
	'backbone'
], function(
    Backbone
) {

    var FrameRate = Backbone.Model.extend({
        
        defaults: {
            averageFrameRate: 0,
            currentFrameRate: 0,
            previousFrameRates: []
        }
        
    });
        
    return FrameRate;

});