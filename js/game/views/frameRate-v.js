define([
	'jquery',
	'backbone',
    'jsUtilities'
], function(
    $, 
    Backbone,
    JsUtilities
) {

	var FrameRateView = Backbone.View.extend({
        
		initialize: function() {
            this.jsUtilities = new JsUtilities();
            this.listenTo(this.model.time, 'change:currentFrameTime', this.averageFrameRate);
            this.listenTo(this.model.time, 'change:averageFrameRate', this.render);
		},
		
		render: function() {
			this.$el.html(this.model.time.get('averageFrameRate'));
		},

        calculateCurrentFrameRate: function () {
            return Math.round(1000 / (this.model.time.get('currentFrameTime') - this.model.time.get('previousFrameTime')));
        },
        
        averageFrameRate: function () {
            var previousFrameRates = this.model.time.get('previousFrameRates').slice();
            if (previousFrameRates.length === 30) {
                previousFrameRates.shift();
            }
            previousFrameRates.push(this.calculateCurrentFrameRate());
            this.model.time.set('previousFrameRates', previousFrameRates);
            this.model.time.set('averageFrameRate', Math.round(this.jsUtilities.array.average(this.model.time.get('previousFrameRates'))));
        }
        
	});
	
	return FrameRateView;
});