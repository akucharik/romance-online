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
            maxMovementRange: 4,
            movementRange: 4,
            spritesheet: document.getElementById('spritesheet'),
            spriteX: 0,
            spriteY: 0,
            velocity: 200,
            x: null,
            y: null
		},
        
        initialize: function () {
            
        },
        
        reset: function () {
            this.set('movementRange', this.get('maxMovementRange'));
        },
        
		updateAttribute: function(attribute, change) {
			var currentAttribute = this.get('attributes').get(attribute);
            var currentAvailable = this.get('attributes').get('available');
            
            if (currentAttribute < constants.character.ATTRIBUTE_MAX && currentAttribute > 0 && currentAvailable > 0) {
                this.get('attributes').set(attribute, currentAttribute + change);
                this.get('attributes').set('available', currentAvailable + (change * -1));
            }
            
            return this.get('attributes').get(attribute);
		},
        
        moveTo: function (node, callback) {
            var endTile = node.path.slice(node.length - 1);
            var path = _.clone(node.path);
            this.followPath(path, node, callback);
        },
        
        followPath: function (path, node, callback) {
            if (path.length > 0) {
                //console.log('stepTo: ', this.get('path')[0]);
                var self = this;
                var stepTimer = setInterval(function () {
                    stepTo(path, node, self, callback);
                }, 16);
            }
            else {
                this.set('currentTile', node.path[node.path.length - 1]);
                this.set('movementRange', this.get('movementRange') - node.pathCost);
                callback();
            }
            
            var stepTo = function (path, node, context, callback) {

                var tile = path[0];
                var targetX = tile.x + constants.grid.TILE_SIZE/2;
                var targetY = tile.y + constants.grid.TILE_SIZE/2;
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
                    path.shift();
                    // recursive: move to next tile in path
                    context.followPath(path, node, callback);
                }

            };
            
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
            this.set('x', this.get('currentTile').x + constants.grid.TILE_SIZE/2);
            this.set('y', this.get('currentTile').y + constants.grid.TILE_SIZE/2);
        } 
	});
	
	return CharacterModel;
});