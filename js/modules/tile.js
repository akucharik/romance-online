define([
    'class',
    'modules/constants'
], function(Class, constants) {

    var Tile = Class.extend({
        init: function (gridX, gridY, options) {
            options = options || {};

            this.distanceValues = {};
            this.gridX = gridX;
            this.gridY = gridY;
            this.id = this.buildKey(gridX, gridY);
            this.movementValue = null;
            this.occupied = options.occupied || null;
            this.type = options.type || null;
            this.x = gridX * constants.grid.tileSize;
            this.y = gridY * constants.grid.tileSize;
            
            this.setMovementValue();
        },
        
        buildKey: function (x, y) {
            return x + '_' + y;
        },
        
        getDistanceValue: function (x, y) {
            return this.distanceValues[this.buildKey(x, y)];
        },
        
        isEqual: function (tile) {
            if (this.gridX === tile.gridX && this.gridY === tile.gridY) {
                return true;
            } else {
                return false;
            }
        },
        
        isMoveable: function () {
            if (this.occupied === null && this.type !== constants.tile.type.obstacle ) {
                return true;
            }
            else {
                return false;
            }
        },
        
        setMovementValue: function () {
            switch (this.type) {
                case constants.tile.type.obstacle:
                    this.movementValue = null;
                    break;
                case constants.tile.type.tree:
                    this.movementValue = constants.tile.movementValue.tree;
                    break;
                default:
                    this.movementValue = constants.tile.movementValue.base;
            }
        }
        
    });
    
	return Tile;
});