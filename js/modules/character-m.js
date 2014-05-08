define([
	'backbone',
    'modules/constants',
    'modules/position'
], function(Backbone, constants, Position) {

    var Attributes = Backbone.Model.extend({
        defaults: {
            available: 50,
            intelligence: 50,
            strength: 50
        }
    });
    
	var Character = Backbone.Model.extend({
		defaults: {
            attributes: new Attributes(),
            currentTile: null,
            movementRange: 7,
            path: [],
            position: null,
            sprite: {
                x: 0,
                y: 0,
            },
            spritesheet: document.getElementById('spritesheet'),
            velocity: 200
		},
        
		updateAttribute: function(attribute, change) {
			var currentAttribute = this.get('attributes').get(attribute);
            var currentAvailable = this.get('attributes').get('available');
            
            if (currentAttribute < constants.character.attributeMax && currentAttribute > 0 && currentAvailable > 0) {
                this.get('attributes').set(attribute, currentAttribute + change);
                this.get('attributes').set('available', currentAvailable + (change * -1));
            }
            
            return this.get('attributes').get(attribute);
		},
        
        move: function () {
            var endTile = this.get('path').slice([this.get('path').length - 1])[0];
            var stepTimer = null;

            var stepTo = function (tile, context) {

                var targetX = tile.position.x + constants.grid.tileSize/2;
                var targetY = tile.position.y + constants.grid.tileSize/2;
                var increment = 6;

                // move left
                if (context.get('position').x > targetX) {
                    increment = Math.abs(increment) * -1;
                    context.get('position').x += increment;
                    if (context.get('position').x <= targetX) {
                        context.get('position').x = targetX;
                    }
                }

                // move right
                if (context.get('position').x < targetX) {
                    increment = Math.abs(increment);
                    context.get('position').x += increment;
                    if (context.get('position').x >= targetX) {
                        context.get('position').x = targetX;
                    }
                }

                // move up
                if (context.get('position').y > targetY) {
                    increment = Math.abs(increment) * -1;
                    context.get('position').y += increment;
                    if (context.get('position').y <= targetY) {
                        context.get('position').y = targetY;
                    }
                }

                // move down
                if (context.get('position').y < targetY) {
                    increment = Math.abs(increment);
                    context.get('position').y += increment;
                    if (context.get('position').y >= targetY) {
                        context.get('position').y = targetY;
                    }
                }

                if (context.get('position').x === targetX && context.get('position').y === targetY) {
                    clearInterval(stepTimer);
                    if (context.get('path').length === 1) {
                        context.set('currentTile', endTile);
                    }
                    context.get('path').shift();
                    // recursive: move to next tile in path
                    context.move();
                }

            };

            // step to the first tile in the path
            if (this.get('path').length > 0) {
                console.log('stepTo: ', this.get('path')[0]);
                self = this;
                stepTimer = setInterval(function () {
                    stepTo(self.get('path')[0], self);
                }, 16);
            }
        },
        
        onCurrentTileChange: function () {
            if (this.previous('currentTile') !== null) {
                this.previous('currentTile').occupied = null;
            }
            this.get('currentTile').occupied = this;
            
            return this.currentTile;
        },
        
        setStartPosition: function (tile) {
            this.set('currentTile', tile);
            this.set('position', new Position(this.get('currentTile').position.x + constants.grid.tileSize/2, this.get('currentTile').position.y + constants.grid.tileSize/2));
        } 
	});
    
	var CharacterList = Backbone.Collection.extend({
        
		addCharacter: function (sprite) {
			var character = new Character({
                sprite: sprite
			});
			
            character.on('change:currentTile', character.onCurrentTileChange);
            
			this.add(character);
			return character;
		}
		
	});
	
	return new CharacterList();
});