define([
	'backbone',
    'jquery',
    'views/characterListItem'
], function(
    Backbone,
    $,
    CharacterListItem
) {

	var CharacterListView = Backbone.View.extend({
		
		initialize: function () {
            this.model.get('savedCharacters').each(function (character) {
                this.model.get('characterListItemViews').push(
                    new CharacterListItem({
                        tagName: 'li',
                        model: character,
                        template: '#characterListItemTemplate'
                    })
                );
            }, this);
            this.render();
		},
        
        render: function () {
            this.model.get('characterListItemViews').forEach(function (view) {
                this.$el.append(view.el);
            }, this);

            return this;
        }
        
	});
	
	return CharacterListView;
});