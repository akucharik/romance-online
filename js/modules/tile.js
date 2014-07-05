define([
    'modules/constants'
], function(
    constants
) {

    var Tile = Class.extend({
        init: function (gridX, gridY, options) {
            options = options || {};

            this.cost = null;
            this.gridX = gridX;
            this.gridY = gridY;
            this.id = this.buildKey(gridX, gridY);
            this.occupied = options.occupied || null;
            this.type = options.type || null;
            this.x = gridX * constants.grid.TILE_SIZE;
            this.y = gridY * constants.grid.TILE_SIZE;
            
            this.setCost();
        },
        
        buildKey: function (x, y) {
            return x + '_' + y;
        },
        
        isEqual: function (tile) {
            if (this.gridX === tile.gridX && this.gridY === tile.gridY) {
                return true;
            } else {
                return false;
            }
        },
        
        isMoveable: function () {
            if (this.occupied === null && this.type !== constants.tile.type.OBSTACLE ) {
                return true;
            }
            else {
                return false;
            }
        },
        
        setCost: function () {
            switch (this.type) {
                case constants.tile.type.OBSTACLE:
                    this.cost = constants.tile.cost.OBSTACLE;
                    break;
                case constants.tile.type.TREE:
                    this.cost = constants.tile.cost.TREE;
                    break;
                default:
                    this.cost = constants.tile.cost.BASE;
            }
        }
        
    });
    
	return Tile;
});