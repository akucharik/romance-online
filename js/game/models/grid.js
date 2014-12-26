define([
	'backbone',
    'constants',
    'models/tile'
], function(
    Backbone, 
    constants,
    Tile
) {
    
	var Grid = Backbone.Model.extend({
		defaults: {
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
            if (typeof x === 'object') {
                return this.get('tiles')[Tile.prototype.buildKey(x.x, x.y)];
            }
            else {
                return this.get('tiles')[Tile.prototype.buildKey(x, y)];
            }
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
        }
        
	});
	
	return Grid;
});