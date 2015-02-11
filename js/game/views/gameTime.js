// @author      Adam Kucharik <akucharik@gmail.com>
// @copyright   2015 Adam Kucharik
// @license     

define([
	'backbone'
], function (
    Backbone
) {
    
    'use strict';

	var GameTimeView = Backbone.View.extend({
        
		initialize: function () {
            this.listenTo(this.model, 'change:elapsedGameTime', this.render);
		},
		
		render: function () {
            this.el.innerHTML = this.formatTime(this.model.get('elapsedGameTime'));
		},
        
        formatTime: function (time) {
            return parseFloat(Math.round((time * 10)) / 10).toFixed(1);
        }
        
	});
	
	return GameTimeView;
});