define([
	'backbone'
], function(Backbone) {

    var average = function (list) {
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            total += list[i];
        }
        return total / list.length;
    };  
    
    var FrameRate = Backbone.Model.extend({
		defaults: {
			averageRate: 0,
            currentRate: 0,
            currentTime: Date.now(),
            lastCalledTime: Date.now(),
            lastXRates: []
		},
        
        calculateCurrentFrameRate: function () {
            return Math.round(1000 / (this.get('currentTime') - this.get('lastCalledTime')));
        },
        
        logFrameRate: function (currentRate) {
            var newLastXRates = this.get('lastXRates').slice();
            if (newLastXRates.length === 60) {
                newLastXRates.shift();
            }
            newLastXRates.push(currentRate);
            this.set('lastXRates', newLastXRates);
        },
        
        setAverageFrameRate: function () {
            this.set('averageRate', Math.round(average(this.get('lastXRates'))));
        }
	});
    
    var GameTime = Backbone.Model.extend({
		defaults: {
			time: 0
		},
        
        setGameTime: function (deltaTime) {
            var newTime = this.get('time') + deltaTime;
            this.set('time', newTime);
            return newTime;
        }
	});
    
	return {
        average: average,
        FrameRate: new FrameRate(),
        GameTime: new GameTime()
    };
});