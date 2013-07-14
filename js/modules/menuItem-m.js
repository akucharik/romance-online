define([
	'backbone'
], function(Backbone) {

	var MenuItem = Backbone.Model.extend({
		defaults: {
			name: '',
			menu: '',
			disabled: false,
			visible: true
		}
	});
	
	var MenuItems = Backbone.Collection.extend({
		
		addMenuItem: function(name, menu) {
			var menuItem = new MenuItem({
				name: name,
				menu: menu
			});
			
			this.add(menuItem);
			return menuItem;
		}
		
	});
	
	return new MenuItems();
});