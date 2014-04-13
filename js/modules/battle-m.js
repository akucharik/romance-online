define([
	'backbone'
], function(Backbone) {

	var Battle = Backbone.Model.extend({
		defaults: {
			name: ''
		}
	});
	
	var BattleList = Backbone.Collection.extend({
		
		addBattle: function(name) {
			var battle = new Battle({
				name: name
			});
			
			this.add(battle);
			return battle;
		}
		
	});
	
	return new BattleList();
});