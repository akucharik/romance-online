define([
	'backbone',
    'utilities',
    'time'
], function(
    Backbone,
    Utilities,
    time
) {

	var FrameRateView = Backbone.View.extend({
        
		initialize: function() {
            this.listenTo(time.model, 'change:frameTime', this.averageFrameRate);
            this.listenTo(this.model, 'change:averageFrameRate', this.render);
		},
		
		render: function() {
			this.el.innerHTML = this.model.get('averageFrameRate');
		},

        calculateCurrentFrameRate: function () {
            return Math.round(1 / time.model.get('elapsedFrameTime'));
        },
        
        averageFrameRate: function () {
            var previousFrameRates = this.model.get('previousFrameRates').slice();
            if (previousFrameRates.length === 30) {
                previousFrameRates.shift();
            }
            previousFrameRates.push(this.calculateCurrentFrameRate());
            this.model.set('previousFrameRates', previousFrameRates);
            this.model.set('averageFrameRate', Math.round(Utilities.Math.average(this.model.get('previousFrameRates'))));
        }
        
	});
	
	return FrameRateView;
});