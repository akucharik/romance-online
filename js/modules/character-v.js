define([
	'backbone',
    'modules/constants'
], function(
    Backbone,
    constants
) {

	var CharacterView = Backbone.View.extend({
		
		initialize: function(options) {
            this.parent = options.parent;
			this.listenTo(this.model, 'change:currentTile', this.onCurrentTileChange);
		},
        
        moveTo: function (node, callback) {
            var endTile = node.path.slice(node.length - 1);
            var path = _.clone(node.path);
            this.followPath(path, node, callback);
        },
        
        followPath: function (path, node, callback) {
            if (path.length > 0) {
                //console.log('stepTo: ', this.get('path')[0]);
                var model = this.model;
                var view = this;
                var stepTimer = setInterval(function () {
                    stepTo(path, node, model, view, callback);
                }, 16);
            }
            else {
                this.model.set('currentTile', node.path[node.path.length - 1]);
                this.model.set('movementRange', this.model.get('movementRange') - node.pathCost);
                callback();
            }
            
            var stepTo = function (path, node, context, view, callback) {

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
                    view.followPath(path, node, callback);
                }

            };
            
        },
        
        attack: function () {
            
        },
        
        reset: function () {
            this.model.set('movementRange', this.model.get('maxMovementRange'));
        },
        
        tactic: function () {
            
        },
        
        wait: function () {
            
        },
        
        onCurrentTileChange: function () {
            if (this.model.previous('currentTile') !== null) {
                this.model.previous('currentTile').occupied = null;
            }
            this.model.get('currentTile').occupied = this;
            
            return this.model.currentTile;
        },
        
        setStartPosition: function (character, tile) {
            character.set('currentTile', tile);
            character.set('x', character.get('currentTile').x + constants.grid.TILE_SIZE/2);
            character.set('y', character.get('currentTile').y + constants.grid.TILE_SIZE/2);
        },
        
        updateAttribute: function(attribute, change) {
			var currentAttribute = this.model.get(attribute)
            var currentAvailable = this.model.get('availableAttributePoints');
            
            if (currentAttribute < constants.character.ATTRIBUTE_MAX && currentAttribute > 0 && currentAvailable > 0) {
                this.model.set(attribute, currentAttribute + change);
                this.model.set('availableAttributePoints', currentAvailable + (change * -1));
            }
            
            return this.model.get(attribute);
		}
        
	});
	
	return CharacterView;
});