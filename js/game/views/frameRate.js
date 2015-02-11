// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
	'backbone',
    'utilities',
    'time'
], function (
    Backbone,
    Utilities,
    time
) {
    
    'use strict';

	var FrameRateView = Backbone.View.extend({
        
		initialize: function () {
            this.listenTo(time, 'change:frameTime', this.averageFrameRate);
            this.listenTo(this.model, 'change:averageFrameRate', this.render);
		},
		
		render: function () {
			this.el.innerHTML = this.model.get('averageFrameRate');
		},

        calculateCurrentFrameRate: function () {
            return Math.round(1 / time.get('elapsedFrameTime'));
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