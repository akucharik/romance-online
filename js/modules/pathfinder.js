define([
    'class',
    'modules/tile'
], function(Class, Tile) {

    var Pathfinder = Class.extend({
        init: function (tiles) {
            this.path = [],
            this.tiles = tiles;
        },

        clearPath: function () {
            this.path = [];
        },
        
        findPath: function (endTile, character) {
            var currentTile = character.currentTile;
            var newPath = [];

            for (var i = 0; i < character.movementRange; i++) {
                var deltaTileCol = currentTile.gridPosition.x - endTile.gridPosition.x;
                var deltaTileRow = currentTile.gridPosition.y - endTile.gridPosition.y;

                // default the next position to the current position
                var nextTile = new Tile(currentTile.gridPosition.x, currentTile.gridPosition.y, false);

                // determine next tile to step to
                if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
                    if (deltaTileRow < 0) {
                        nextTile.gridPosition.y++;
                    }
                    if (deltaTileRow > 0) {
                        nextTile.gridPosition.y--;
                    }
                }
                if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
                    if (deltaTileCol < 0) {
                        nextTile.gridPosition.x++;
                    }
                    if (deltaTileCol > 0) {
                        nextTile.gridPosition.x--;
                    }
                }
                currentTile = this.tiles[nextTile.gridPosition.x][nextTile.gridPosition.y];
                newPath.push(currentTile);

                // end path
                if (currentTile.isEqual(endTile)) {
                    break;
                }
            }

            // only set the path if the focused tile is in the path
            if (endTile.isEqual(newPath[newPath.length - 1])) {
                this.path = newPath;
            }
            else { 
                this.path = [];
            }
        },

        isTileInPath: function (tile) {
            for (var i = 0; i < this.path.length; i++) {
                if (this.path[i].isEqual(tile)) {
                    return true;
                }
            };
            return false;
        },

        selectPath: function (character) {
            character.path = this.path.slice();
            this.path = [];
        }
    });
    
	return Pathfinder;
});