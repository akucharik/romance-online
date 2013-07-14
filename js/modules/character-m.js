define([
	'backbone'
], function(Backbone) {

	var Character = Backbone.Model.extend({
		defaults: {
			name: '',
			strength: 0,
			intelligence: 0,
			happiness: 0,
			available: 100
		},
		
		addPointToAttribute: function(attr, change) {
			var cur = this.get(attr);
			
			this.set(attr, cur + change);
			// adjust available accordingly.
		}
	});
	
	var CharactersList = Backbone.Collection.extend({
		
		addNewChar: function(name) {
			var c = new Character({
				name: name
			});
			
			this.add(c);
			return c;
		}
		
	});
	
	return new CharactersList();
});