// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
	'backbone'
], function (
    Backbone
) {
    
    'use strict';

	var TimeController = function (options) {
        
        _.extend(this, Backbone.Events);
        var options = options || {};
        this.model = options.model;
        this.initialize();
    };
    
    TimeController.prototype = {
        
        initialize: function () {
            this.listenTo(this.model, 'change:frameTime', this.update);
            this.listenTo(this.model, 'change:isPaused', this.onIsPausedChange);
		},
        
        onIsPausedChange: function () {
            if (this.model.get('isPaused')) {
                this.stopListening(this.model, 'change:frameTime', this.update);
                this.model.set('pauseTime', Date.now());
                
                return this.model.get('elapsedGameTime');
            }
            else {
                this.model.set('frameTime', Date.now() / 1000);
                this.listenTo(this.model, 'change:frameTime', this.update);
                this.model.set('pauseDuration', (Date.now() - this.model.get('pauseTime')) / 1000);
                
                return this.model.get('pauseDuration');
            }  
        },
        
        reset: function () {
            this.model.set('elapsedGameTime', 0);
            
            return this;
        },
        
        update: function () {
            this.model.set('elapsedFrameTime', this.model.get('frameTime') - this.model.previous('frameTime'));
            this.model.set('elapsedGameTime', this.model.get('elapsedGameTime') + this.model.get('elapsedFrameTime'));
            
            return this;
        }
    };
    
    TimeController.prototype.constructor = TimeController;
	
	return TimeController;
});