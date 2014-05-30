define([
	'jquery',
	'backbone',
    'modules/utilities/frameRate-v',
    'modules/utilities/time-v'
], function(
    $, 
    Backbone,
    FrameRateView,
    TimeView
) {

	var GameUtilitiesView = Backbone.View.extend({
        
		initialize: function() {
			this.frameRate = new FrameRateView({
                model: this.model,
                el: document.querySelector('#frameRate')
            });
            this.time = new TimeView({
                model: this.model,
                el: document.querySelector('#gameTime')
            });
		},
		
		render: function() {

		}
        
	});
	
	return GameUtilitiesView;
});