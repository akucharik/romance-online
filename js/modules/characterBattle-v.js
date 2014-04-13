define([
	'jquery',
	'backbone',
	'modules/character-m'
], function($, Backbone, characterModel) {

	var CharacterBattleView = Backbone.View.extend({
		el: '#foreground',
		
		initialize: function() {
			this.listenTo(characterModel, 'add remove', this.render);
		},
        
		render: function() {
//			characterModel.each(function(model) {
//				html += '<li data-cid="'+ model.cid +'">'+ model.get('name') +'</li>';
//			});
		},
		
		events: {
//			'click .add': 'onAdd',
//			'click #character-list li': 'onSelectChar'
		},
		
		onAdd: function() {
//			var name = this.$input.val();
//			if (name) {
//				characterModel.addNewChar(name);
//				this.$input.val('');
//			}
		},
		
		onSelectChar: function(evt) {
//			var cid = $(evt.target).attr('data-cid');
//			var model = characterModel.get(cid);
//			// ... switch to detail view for selected character...
		}
	});
    
	return new CharacterBattleView();
});