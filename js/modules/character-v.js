define([
	'backbone'
], function(
    Backbone
) {

	var CharacterView = Backbone.View.extend({
		
		initialize: function() {
			this.listenTo(this.model, 'change:currentTile', this.onCurrentTileChange);
		},
        
        move: function () {
            var endTile = this.model.get('path').slice([this.model.get('path').length - 1])[0];
            var stepTimer = null;

            var stepTo = function (tile, context) {

                var targetX = tile.x + constants.grid.TILE_SIZE/2;
                var targetY = tile.y + constants.grid.TILE_SIZE/2;
                var increment = 6;
                var x = context.model.get('x');
                var y = context.model.get('y');

                // move left
                if (x > targetX) {
                    increment = Math.abs(increment) * -1;
                    context.model.set('x', x + increment);
                    if (x <= targetX) {
                        context.model.set('x', targetX);
                    }
                }

                // move right
                if (x < targetX) {
                    increment = Math.abs(increment);
                    context.model.set('x', x + increment);
                    if (x >= targetX) {
                        context.model.set('x', targetX);
                    }
                }

                // move up
                if (y > targetY) {
                    increment = Math.abs(increment) * -1;
                    context.model.set('y', y + increment);
                    if (y <= targetY) {
                        context.model.set('y', targetY);
                    }
                }

                // move down
                if (y < targetY) {
                    increment = Math.abs(increment);
                    context.model.set('y', y + increment);
                    if (y >= targetY) {
                        context.model.set('y', targetY);
                    }
                }

                if (x === targetX && y === targetY) {
                    clearInterval(stepTimer);
                    if (context.model.get('path').length === 1) {
                        context.model.set('currentTile', endTile);
                    }
                    context.model.get('path').shift();
                    // recursive: move to next tile in path
                    context.model.move();
                }

            };

            // step to the first tile in the path
            if (this.model.get('path').length > 0) {
                //console.log('stepTo: ', this.get('path')[0]);
                self = this;
                stepTimer = setInterval(function () {
                    stepTo(this.model.get('path')[0], self);
                }, 16);
            }
        },
        
        onCurrentTileChange: function () {
            if (this.model.previous('currentTile') !== null) {
                this.model.previous('currentTile').occupied = null;
            }
            this.model.get('currentTile').occupied = this;
            
            return this.model.currentTile;
        },
        
	});
	
	return CharacterView;
});