define([
	'jquery',
	'backbone',
	'modules/character-m'
], function($, Backbone, characterManager) {

	var CharacterView = Backbone.View.extend({
		el: '#characters-manager',
		
		initialize: function() {
			this.listenTo(characterManager, 'add remove', this.render);
			this.$input = this.$('#character-name');
			this.$list = this.$('#character-list');
		},
		
		render: function() {
			
			var html = '';
			
			characterManager.each(function(model) {
				html += '<li data-cid="'+ model.cid +'">'+ model.get('name') +'</li>';
			});
			
			this.$list.html(html);
		},
		
		events: {
			//'keydown #character-name': 'onChange',
			'click .add': 'onAdd',
			'click #character-list li': 'onSelectChar'
		},
		
		onAdd: function() {
			var name = this.$input.val();
			if (name) {
				characterManager.addNewChar(name);
				this.$input.val('');
			}
		},
		
		onSelectChar: function(evt) {
			var cid = $(evt.target).attr('data-cid');
			var model = characterManager.get(cid);
			// ... switch to detail view for selected character...
		}
	});
	
	window.chars = characterManager;
	
	return new CharacterView();
});