define([
	'backbone',
    'modules/constants',
    'modules/tile'
], function(Backbone, constants, Tile) {
    
	var Grid = Backbone.Model.extend({
		defaults: {
            focusedTile: null,
            selectedTile: null,
            tiles: {},
            tilesX: (constants.canvas.width - (constants.canvas.width % constants.grid.tileSize)) / constants.grid.tileSize,
            tilesY: (constants.canvas.height - (constants.canvas.height % constants.grid.tileSize)) / constants.grid.tileSize
		},
        
        initialize: function () {
            for (var y = 0; y < this.get('tilesY'); y++) {
                for (var x = 0; x < this.get('tilesX'); x++) {
                    // TODO: temporarily create different tile types
                    var options = {
                        occupied: null,
                        type: this.determineTileType(x) //x % (Math.random() * 10) > 5 ? constants.tile.type.obstacle : constants.tile.type.normal
                    }
                    var newTile = new Tile(x, y, options);
                    this.get('tiles')[x + '_' + y] = newTile;
                }
            }
            this.setDistanceValues();
        },
        
        determineTileType: function (tileX) {
            var x = tileX % (Math.random() * 10)
            switch (true) {
                case x > 5:
                    return constants.tile.type.obstacle;
                case x > 2 && x < 5:
                    return constants.tile.type.tree;
                default:
                    return constants.tile.type.normal;
            }
        },
        
        getTile: function (x, y) {
            return this.get('tiles')[x + '_' + y];
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
            backgroundX = (backgroundX > constants.canvas.width) ? constants.canvas.width : backgroundX;
            
            var x = Math.floor(backgroundX / constants.grid.tileSize);
            var y = Math.floor(backgroundY / constants.grid.tileSize);

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
        
        setDistanceValues: function () {
            var tiles = this.get('tiles');
            for (var i in tiles) {
                var distanceValues = {};
                for (var j in tiles) {
                    var distanceValue = Math.abs(tiles[i].gridPosition.x - tiles[j].gridPosition.x) + Math.abs(tiles[i].gridPosition.y - tiles[j].gridPosition.y);
                    distanceValues[j] = distanceValue;
                }
                tiles[i].distanceValues = distanceValues;
            }
        },
        
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.position.x + indent/2, tile.position.y + indent/2, constants.grid.tileSize - indent, constants.grid.tileSize - indent);
            }
        }
        
	});
	
	return new Grid();
});