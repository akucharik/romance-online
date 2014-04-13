define([
	'jquery',
	'backbone',
	'modules/utilities-m'
], function($, Backbone, UtilitiesModel) {

	var UtilitiesView = Backbone.View.extend({
		el: '#utilities',
		
		initialize: function() {
			this.listenTo(UtilitiesModel.FrameRate, 'change:averageRate', this.render);
            this.listenTo(UtilitiesModel.GameTime, 'change:time', this.render);
			this.$frameRate = this.$('#frameRate');
            this.$gameTime = this.$('#gameTime');
		},
		
		render: function() {
			this.$frameRate.html(UtilitiesModel.FrameRate.get('averageRate'));
            this.$gameTime.html(
                parseFloat(Math.round((UtilitiesModel.GameTime.get('time') * 10)) / 10).toFixed(1)
            );
		}
	});
	
	return new UtilitiesView();
});