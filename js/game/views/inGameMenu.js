// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
	'backbone',
    'jquery',
    'time'
], function (
    Backbone,
    $,
    time
) {
    
    'use strict';

	var InGameMenuView = Backbone.View.extend({
		
		initialize: function () {
            this.$elPause = this.$el.find('#pause');
            this.$elResume = this.$el.find('#resume');
            this.listenTo(time, 'change:isPaused', this.render);
            this.render();
		},
        
        render: function () {
            if (time.get('isPaused')) {
                this.$elPause.hide();
                this.$elResume.show();
            }
            else {
                this.$elPause.show();
                this.$elResume.hide();
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