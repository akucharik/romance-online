define([
	'backbone',
    'jquery',
    'views/characterListItem'
], function(
    Backbone,
    $,
    CharacterListItemView
) {

	var CharacterListView = Backbone.View.extend({
		
		initialize: function () {
            this.$placeholder = $(document.createDocumentFragment());
            
            this.listenTo(this.collection, 'add change:name remove', this.render);
            this.render();
		},
        
        render: function () {
            this.collection.sort();
            this.$placeholder.empty();
            
            this.collection.each(function (character) {
                var characterListItemView = new CharacterListItemView({
                    model: character,
                    tagName: 'tr',
                    template: '#characterListItemTemplate'
                });
                this.$placeholder.append(characterListItemView.el);
            }, this);

            this.$el.html(this.$placeholder);
            
            return this;
        }
        
//        // This is an experiment in caching views.
//        // Not necessary here, but will need for canvas rendering performance elsewhere.
//        buildViews: function () {
//            this.views = [];
//            
//            this.collection.each(function (character) {
//                this.views.push(
//                    new CharacterListItem({
//                        model: character,
//                        tagName: 'li',
//                        template: '#characterListItemTemplate'
//                    })
//                );
//            }, this);
//        },
        
//        render: function () {
//            this.views.forEach(function (view) {
//                this.$placeholder.append(view.el);
//            }, this);
//
//            this.$el.empty();
//            this.$el.append(this.$placeholder)
//            
//            return this;
//        },
        
//        rerender: function () {
//            this.buildViews();
//            this.render();
//        }
        
	});
	
	return CharacterListView;
});