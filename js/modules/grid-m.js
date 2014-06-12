define([
	'backbone',
    'modules/constants',
    'modules/tile'
], function(
    Backbone, 
    constants,
    Tile
) {
    
	var Grid = Backbone.Model.extend({
		defaults: {
            focusedTile: null,
            selectedTile: null,
            tiles: {},
            width: (constants.canvas.WIDTH - (constants.canvas.WIDTH % constants.grid.TILE_SIZE)) / constants.grid.TILE_SIZE,
            height: (constants.canvas.HEIGHT - (constants.canvas.HEIGHT % constants.grid.TILE_SIZE)) / constants.grid.TILE_SIZE
		},
        
        initialize: function () {
            for (var y = 0; y < this.get('height'); y++) {
                for (var x = 0; x < this.get('width'); x++) {
                    // TODO: temporarily create different tile types
                    var options = {
                        occupied: null,
                        type: this.getTileType(x) //x % (Math.random() * 10) > 5 ? constants.tile.type.obstacle : constants.tile.type.normal
                    }
                    var newTile = new Tile(x, y, options);
                    this.get('tiles')[Tile.prototype.buildKey(x, y)] = newTile;
                }
            }
        },
        
        getTileType: function (tileX) {
            var x = tileX % (Math.random() * 10)
            switch (true) {
                case x > 5:
                    return constants.tile.type.OBSTACLE;
                case x > 2 && x < 5:
                    return constants.tile.type.TREE;
                default:
                    return constants.tile.type.BASE;
            }
        },
        
        getTile: function (x, y) {
            return this.get('tiles')[Tile.prototype.buildKey(x, y)];
        },
        
        getOccupiedTiles: function () {
            var occupiedTiles = {};
            var tiles = this.get('tiles');
            for (var i in tiles) {
                if (!tiles[i].isMoveable()) {
                    occupiedTiles[i] = tiles[i];
                }
            }
            return occupiedTiles;
        },
        
        hitTest: function (mouseObj, canvas) {		
            var backgroundX = mouseObj.pageX - $(canvas).offset().left;
            var backgroundY = mouseObj.pageY - $(canvas).offset().top;
            
            // handle sub-pixel centering of game if it happens
            backgroundX = (backgroundX < 0) ? 0 : backgroundX;
            backgroundX = (backgroundX > constants.canvas.WIDTH) ? constants.canvas.WIDTH : backgroundX;
            
            var x = Math.floor(backgroundX / constants.grid.TILE_SIZE);
            var y = Math.floor(backgroundY / constants.grid.TILE_SIZE);

            return this.getTile(x, y);

            // TODO: only needed for non-square/rectangle tile shapes
            //drawTile(tile, foregroundCtx)
            //if(foregroundCtx.isPointInPath(backgroundX, backgroundY)) {
            //	return tile;
            //}
            //else {
            //	return null;	
            //}
        },
        
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
            }
        }
        
	});
	
	return Grid;
});