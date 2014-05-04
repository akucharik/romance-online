define([
	'jquery',
	'backbone',
	'modules/utilities-m'
], function($, Backbone, utilitiesModel) {

	var UtilitiesView = Backbone.View.extend({
		el: '#utilities',
		
		initialize: function() {
			this.listenTo(utilitiesModel.frameRate, 'change:averageRate', this.render);
            this.listenTo(utilitiesModel.gameTime, 'change:time', this.render);
			this.$frameRate = this.$('#frameRate');
            this.$gameTime = this.$('#gameTime');
		},
		
		render: function() {
			this.$frameRate.html(utilitiesModel.frameRate.get('averageRate'));
            this.$gameTime.html(
                parseFloat(Math.round((utilitiesModel.gameTime.get('time') * 10)) / 10).toFixed(1)
            );
		}
	});
	
	return new UtilitiesView();
});