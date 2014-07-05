define([
	'backbone',
    'jquery',
    'views/frameRate',
    'views/gameTime'
], function(
    Backbone,
    $, 
    FrameRateView,
    GameTimeView
) {

	var GameUtilitiesView = Backbone.View.extend({
        
		initialize: function() {
			this.frameRate = new FrameRateView({
                model: this.model,
                el: document.querySelector('#frameRate')
            });
            this.gameTime = new GameTimeView({
                model: this.model,
                el: document.querySelector('#gameTime')
            });
		},
		
		render: function() {

		}
        
	});
	
	return GameUtilitiesView;
});