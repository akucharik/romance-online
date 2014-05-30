define([
	'jquery',
	'backbone',
    'modules/utilities/frameRate-v',
    'modules/utilities/gameTime-v'
], function(
    $, 
    Backbone,
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