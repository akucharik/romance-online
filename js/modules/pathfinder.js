define([
    'class',
    'modules/grid-m',
    'modules/tile'
], function(Class, grid, Tile) {

    var Pathfinder = Class.extend({
        init: function () {
            this.path = [],
            this.tiles = grid.get('tiles');
        },

        clearPath: function () {
            if(this.path.length > 0) {
                this.path = [];
            }
        },
        
        findPath: function (endTile, character) {
            var currentTile = character.get('currentTile');
            var newPath = [];

            for (var i = 0; i < character.get('movementRange'); i++) {
                var deltaTileCol = currentTile.gridPosition.x - endTile.gridPosition.x;
                var deltaTileRow = currentTile.gridPosition.y - endTile.gridPosition.y;

                // default the next position to the current position
                var nextTile = new Tile(currentTile.gridPosition.x, currentTile.gridPosition.y);

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
            character.set('path', this.path.slice());
            this.path = [];
        }
    });
    
	return new Pathfinder();
});