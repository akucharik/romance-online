define([
	'jquery',
	'backbone'
], function(
    $, 
    Backbone
) {

	var TimeView = Backbone.View.extend({
        
		initialize: function() {
            this.listenTo(this.model.time, 'change:gameTime', this.render);
		},
		
		render: function() {
            this.$el.html(
                this.formatGameTime(this.model.time.get('gameTime'))
            );
		},
        
        calculateDeltaFrameTime: function() {
            return (this.model.time.get('currentFrameTime') - this.model.time.get('previousFrameTime')) / 1000;
        },
        
        formatGameTime: function(gameTime) {
            return parseFloat(Math.round((gameTime * 10)) / 10).toFixed(1);
        }
        
	});
	
	return TimeView;
});