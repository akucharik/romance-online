define([
	'backbone',
    'jquery'
], function(
    Backbone,
    $
) {

	var CharacterListItemView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.template = _.template($(this.options.template).html());
            this.listenTo(this.model, 'change', this.render);
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        }
        
	});
	
	return CharacterListItemView;
});