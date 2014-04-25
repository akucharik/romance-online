define([
    'class',
    'modules/constants',
    'modules/position'
], function(Class, constants, Position) {

    var Tile = Class.extend({
        init: function (gridX, gridY, isOccupied) {
            this.gridPosition = new Position(gridX, gridY);
            this.position = new Position(gridX * constants.grid.tileSize, gridY * constants.grid.tileSize);
            this.isOccupied = isOccupied;
        }
    });
    
	return Tile;
});