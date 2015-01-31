define([
	'backbone',
    'jquery'
], function(
    Backbone,
    $
) {

	var EventLogItemView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.template = _.template($(this.options.template).html());
            
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        }
        
	});
	
	return EventLogItemView;
});