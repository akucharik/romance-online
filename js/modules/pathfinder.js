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
                var deltaTileCol = currentTile.gridX - endTile.gridX;
                var deltaTileRow = currentTile.gridY - endTile.gridY;

                // default the next position to the current position
                var nextTile = new Tile(currentTile.gridX, currentTile.gridY);

                // determine next tile to step to
                if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
                    if (deltaTileRow < 0) {
                        nextTile.gridY++;
                    }
                    if (deltaTileRow > 0) {
                        nextTile.gridY--;
                    }
                }
                if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
                    if (deltaTileCol < 0) {
                        nextTile.gridX++;
                    }
                    if (deltaTileCol > 0) {
                        nextTile.gridX--;
                    }
                }
                currentTile = grid.getTile(nextTile.gridX, nextTile.gridY);
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
        
        newFindPath: function () {
        
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