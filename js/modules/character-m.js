define([
	'backbone',
    'modules/constants',
    'modules/position'
], function(Backbone, constants, Position) {

    var Attributes = Backbone.Model.extend({
        defaults: {
            available: 100,
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
        
		addPointToAttribute: function(attr, change) {
			var cur = this.get(attr);
			
			this.set(attr, cur + change);
			// adjust available accordingly.
		},
        
        move: function () {
            var stepTimer = null;

            var stepTo = function (tile, self) {

                var targetX = tile.position.x + constants.grid.tileSize/2;
                var targetY = tile.position.y + constants.grid.tileSize/2;
                var increment = 6;

                // move left
                if (self.get('position').x > targetX) {
                    increment = Math.abs(increment) * -1;
                    self.get('position').x += increment;
                    if (self.get('position').x <= targetX) {
                        self.get('position').x = targetX;
                    }
                }

                // move right
                if (self.get('position').x < targetX) {
                    increment = Math.abs(increment);
                    self.get('position').x += increment;
                    if (self.get('position').x >= targetX) {
                        self.get('position').x = targetX;
                    }
                }

                // move up
                if (self.get('position').y > targetY) {
                    increment = Math.abs(increment) * -1;
                    self.get('position').y += increment;
                    if (self.get('position').y <= targetY) {
                        self.get('position').y = targetY;
                    }
                }

                // move down
                if (self.get('position').y < targetY) {
                    increment = Math.abs(increment);
                    self.get('position').y += increment;
                    if (self.get('position').y >= targetY) {
                        self.get('position').y = targetY;
                    }
                }

                if (self.get('position').x === targetX && self.get('position').y === targetY) {
                    clearInterval(stepTimer);
                    self.set('currentTile', tile);
                    self.get('path').shift();
                    // recursive: move to next tile in path
                    self.move();
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
        
        setStartPosition: function (tile) {
            this.set('currentTile', tile);
            this.set('position', new Position(this.get('currentTile').position.x + constants.grid.tileSize/2, this.get('currentTile').position.y + constants.grid.tileSize/2));
        } 
	});
    
	var CharacterList = Backbone.Collection.extend({
		
		addCharacter: function(sprite) {
			var character = new Character({
                sprite: sprite
			});
			
			this.add(character);
			return character;
		}
		
	});
	
	return new CharacterList();
});