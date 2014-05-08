define([
    'class',
    'modules/constants',
    'modules/position'
], function(Class, constants, Position) {

    var Tile = Class.extend({
        init: function (gridX, gridY, options) {
            if (typeof options !== 'object') {
                var options = {
                    occupied: null,
                    type: constants.tile.type.normal
                }
            }

            this.gridPosition = new Position(gridX, gridY);
            this.position = new Position(gridX * constants.grid.tileSize, gridY * constants.grid.tileSize);
            this.occupied = typeof options.occupied === 'undefined' ? null : options.occupied;
            this.type = typeof options.type === 'undefined' ? null : options.type;
        },
        
        isEqual: function (tile) {
            if (this.gridPosition.x === tile.gridPosition.x && this.gridPosition.y === tile.gridPosition.y) {
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
        }
        
    });
    
	return Tile;
});