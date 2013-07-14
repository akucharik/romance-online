define([
	'jquery',
	'backbone',
	'modules/menuItem-m',
	'modules/character-m'
], function($, Backbone, menuItems, characters) {

	var StartMenuView = Backbone.View.extend({
		el: '#startMenu',
		
		initialize: function() {
			this.$menu = this.$('#startMenuItems');
			
			//create the 'Start' menu items
			if (!window.menuItems) {
				window.menuItems = menuItems;
			}
			menuItems.addMenuItem('Load Game', 'Start');
		        menuItems.addMenuItem('New Game', 'Start');
		        menuItems.addMenuItem('New Character', 'Start');
		        menuItems.addMenuItem('Edit Character', 'Start');
			
			//get just the 'Start' menu items
			this.startMenuItems = menuItems.where({menu: 'Start'});
			
			//get the individual menu items for future use
			this.loadGame = menuItems.where({name: 'Load Game', menu: 'Start'})[0];
			this.newGame = menuItems.where({name: 'New Game', menu: 'Start'})[0];
			this.newCharacter = menuItems.where({name: 'New Character', menu: 'Start'})[0];
			this.editCharacter = menuItems.where({name: 'Edit Character', menu: 'Start'})[0];
			
			//listen for menu item property changes
			this.listenTo(menuItems, 'change', this.render);
			
			//listen for characters being added/removed
			this.listenTo(characters, 'add remove', this.render);
			
			//initial menu render
			this.render();
		},
		
		render: function() {
			var html = '';
			
			//set visibility of the 'Load Game' action
			this.loadGame.set('visible', false);
			
			//set visibility of the 'Edit Character' action
			this.editCharacter.set('visible', (characters.length > 0 ? true : false));
			
			//render 'Start' menu to the screen
			for (var i = 0; i < this.startMenuItems.length; i++) {
				if (this.startMenuItems[i].get('visible') === true) {
					html += '<li>' +
							'<button id="'+ this.startMenuItems[i].cid +'">' + 
								this.startMenuItems[i].get('name') +
							'</button>' +
						'</li>';
				}
			};
			
			this.$menu.html(html);
			
			return this;
		},
		
		events: function() {
			var eventsObj = {};
			
			eventsObj['click #' + this.newCharacter.cid] = 'onNewCharacter';

			return eventsObj;
		},
		
		onNewCharacter: function() {
			alert("New Character");
		}
	});
	
	return new StartMenuView();
});