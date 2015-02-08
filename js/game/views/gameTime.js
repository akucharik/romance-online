define([
	'backbone'
], function(
    Backbone
) {

	var GameTimeView = Backbone.View.extend({
        
		initialize: function () {
            this.listenTo(this.model, 'change:gameTime', this.render);
		},
		
		render: function () {
            this.el.innerHTML = this.formatGameTime(this.model.get('gameTime'));
		},
        
        formatGameTime: function (gameTime) {
            return parseFloat(Math.round((gameTime * 10)) / 10).toFixed(1);
        }
        
	});
	
	return GameTimeView;
});