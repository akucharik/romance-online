define([
	'backbone',
    'modules/constants'
], function(
    Backbone,
    constants
) {

    var Attributes = Backbone.Model.extend({
        defaults: {
            available: 50,
            intelligence: 50,
            strength: 50
        }
    });
    
	var CharacterModel = Backbone.Model.extend({
		defaults: {
            attributes: new Attributes(),
            currentTile: null,
            movementRange: 4,
            path: [],
            spritesheet: document.getElementById('spritesheet'),
            spriteX: 0,
            spriteY: 0,
            velocity: 200,
            x: null,
            y: null
		},
        
        initialize: function () {
            
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

                var targetX = tile.x + constants.grid.tileSize/2;
                var targetY = tile.y + constants.grid.tileSize/2;
                var increment = 6;
                var x = context.get('x');
                var y = context.get('y');

                // move left
                if (x > targetX) {
                    increment = Math.abs(increment) * -1;
                    context.set('x', x + increment);
                    if (x <= targetX) {
                        context.set('x', targetX);
                    }
                }

                // move right
                if (x < targetX) {
                    increment = Math.abs(increment);
                    context.set('x', x + increment);
                    if (x >= targetX) {
                        context.set('x', targetX);
                    }
                }

                // move up
                if (y > targetY) {
                    increment = Math.abs(increment) * -1;
                    context.set('y', y + increment);
                    if (y <= targetY) {
                        context.set('y', targetY);
                    }
                }

                // move down
                if (y < targetY) {
                    increment = Math.abs(increment);
                    context.set('y', y + increment);
                    if (y >= targetY) {
                        context.set('y', targetY);
                    }
                }

                if (x === targetX && y === targetY) {
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
            this.set('x', this.get('currentTile').x + constants.grid.tileSize/2);
            this.set('y', this.get('currentTile').y + constants.grid.tileSize/2);
        } 
	});
	
	return CharacterModel;
});