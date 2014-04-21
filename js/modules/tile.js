define([
    'class',
    'modules/constants',
    'modules/position'
], function(Class, constants, Position) {

    var Tile = Class.extend({
        init: function (gridRow, gridCol, isOccupied) {
            this.gridPosition = new Position(gridRow, gridCol);
            this.position = new Position(gridRow * constants.grid.tileSize, gridCol * constants.grid.tileSize);
            this.isOccupied = isOccupied;
        }
    });
    
	return Tile;
});