// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
	'backbone'
], function (
    Backbone
) {
    
    'use strict';
    
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
            
            // Bools
            isPaused: false
        }
        
    });
        
    return TimeModel;

});