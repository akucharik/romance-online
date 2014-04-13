define([
	'backbone'
], function(Backbone) {

	var Character = Backbone.Model.extend({
		defaults: {
            attributes: {
                available: 100,
                strength: 0,
                intelligence: 0,
                happiness: 0
            },
            currentTile: null,
			movementRange: 7,
            name: '',
			possiblePath: null,
			path: null,
			spritesheet: document.getElementById('spritesheet'),
			targetTile: null,
			targetX: null,
			targetY: null,
			velocity: 200,
			x: null,
			y: null
		},
		
		addPointToAttribute: function(attr, change) {
			var cur = this.get(attr);
			
			this.set(attr, cur + change);
			// adjust available accordingly.
		}
	});
	
	var CharacterList = Backbone.Collection.extend({
		
		addCharacter: function(name) {
			var character = new Character({
				name: name
			});
			
			this.add(character);
			return character;
		}
		
	});
	
	return new CharacterList();
});