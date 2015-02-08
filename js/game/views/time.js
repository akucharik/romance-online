define([
	'backbone'
], function(
    Backbone
) {

	var TimeView = Backbone.View.extend({
        
		initialize: function() {
            this.listenTo(this.model, 'change:frameTime', this.update);
		},
        
        update: function() {
            this.model.set('frameTimeDelta', this.model.get('frameTime') - this.model.previous('frameTime'));
            this.model.set('gameTime', this.model.get('gameTime') + this.model.get('frameTimeDelta'));
        }
        
	});
	
	return TimeView;
});