define([
	'backbone',
	'jquery',
    'models/menuItem'
], function(Backbone, $, menuItems) {

	var MenuItemsView = Backbone.View.extend({
		el: '#menu',
		
		initialize: function() {
			//this.listenTo(menuItems, 'add remove', this.render);
			//this.$list = this.$('#menuItems');
			//this.menuCanvas = this.$('#menuCanvas');
			//this.menuCanvasCtx = this.menuCanvas[0].getContext('2d');
		},
		
		render: function() {
			
			//fiddle: rendering menu items to canvas
			/*
			var ctx = this.menuCanvas[0].getContext('2d');
			var posY = 16;
			
			ctx.fillStyle = "red";
			ctx.font = "16px Arial";
			
			menuItems.each(function(model) { 
				ctx.fillText(model.get('name'), 20, posY);
				posY += 16;
			});
			*/
		},
		
		events: {
			//examples from Greg
			//'keydown #character-name': 'onChange',
			//'click .add': 'onAdd',
			//'click #character-list li': 'onSelectChar'
		}
	});
	
	window.menuItems = menuItems;
	
	return new MenuItemsView();
});