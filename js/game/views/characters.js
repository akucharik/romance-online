define([
	'backbone',
    'jquery',
    'constants',
    'views/characterList'
], function(
    Backbone,
    $,
    constants,
    CharacterListView
) {

	var charactersView = Backbone.View.extend({
		
		initialize: function (options) {
            this.options = options;
            this.template = _.template($(this.options.template).html());
            
            this.render();
		},
        
        render: function () {
            this.$el.html(this.template());
            
            this.characterListView = new CharacterListView({
                collection: this.model.get('savedCharacters')
            });
            
            this.$el.find('#characterList').append(this.characterListView.el);
            
            return this;
        },
        
        events: {
            'click #mainMenu': 'mainMenu',
        },
        
        mainMenu: function () {
            this.model.set('mode', constants.home.mode.MAIN_MENU);
            this.remove();
        }
        
	});
	
	return charactersView;
});