define([
	'backbone',
    'jquery',
    'time'
], function(
    Backbone,
    $,
    time
) {

	var InGameMenuView = Backbone.View.extend({
		
		initialize: function () {
            this.$pause = this.$el.find('#pause');
            this.$resume = this.$el.find('#resume');
            this.listenTo(time, 'change:isPaused', this.render);
            this.render();
		},
        
        render: function () {
            if (time.get('isPaused')) {
                this.$pause.hide();
                this.$resume.show();
            }
            else {
                this.$pause.show();
                this.$resume.hide();
            }

            return this;
        },
        
        events: {
            'click #pause': 'onPause',
            'click #resume': 'onResume'
        },
        
        onPause: function () {
            time.set('isPaused', true);
        },
        
        onResume: function () {
            time.set('isPaused', false);
        }
        
	});
	
	return InGameMenuView;
});