define([
	'backbone'
], function(
    Backbone
) {

	var TimeView = Backbone.View.extend({
        
		initialize: function() {
            this.listenTo(this.model, 'change:frameTime', this.update);
		},
        
        pause: function () {
            this.model.set('pauseTime', Date.now());
            this.stopListening(this.model, 'change:frameTime', this.update);
            this.model.set('paused', true);
            
            return this.model.get('elapsedGameTime');
        },
        
        reset: function () {
            this.model.set('elapsedGameTime', 0);
            
            return this;
        },
        
        resume: function () {
            this.model.set('pauseDuration', (Date.now() - this.model.get('pauseTime')) / 1000);
            this.listenTo(this.model, 'change:frameTime', this.update);
            this.model.set('paused', false);
            
            return this.model.get('pauseDuration');
        },
        
        update: function() {
            this.model.set('elapsedFrameTime', this.model.get('frameTime') - this.model.previous('frameTime'));
            this.model.set('elapsedGameTime', this.model.get('elapsedGameTime') + this.model.get('elapsedFrameTime'));
            
            return this;
        }
        
	});
	
	return TimeView;
});