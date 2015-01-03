define([
	'backbone',
    'constants',
    'models/tile',
    'views/mapTile'
], function(
    Backbone, 
    constants,
    Tile,
    MapTileView
) {
    
	var Grid = Backbone.Model.extend({
		defaults: {
            tiles: {},
            tileViews: [],
            width: (constants.canvas.WIDTH - (constants.canvas.WIDTH % constants.grid.TILE_SIZE)) / constants.grid.TILE_SIZE,
            height: (constants.canvas.HEIGHT - (constants.canvas.HEIGHT % constants.grid.TILE_SIZE)) / constants.grid.TILE_SIZE
		},
        
        initialize: function () {
            for (var y = 0; y < this.get('height'); y++) {
                for (var x = 0; x < this.get('width'); x++) {
                    // TODO: temporarily create different tile types
                    var options = {
                        gridX: x,
                        gridY: y,
                        type: this.getTileType(x) //x % (Math.random() * 10) > 5 ? constants.tile.type.obstacle : constants.tile.type.normal
                    }
                    var newTile = new Tile(options);
                    this.get('tiles')[Tile.prototype.buildKey(x, y)] = newTile;
                    var newTileView = new MapTileView({
                        model: newTile,
                        tagName: 'canvas'
                    });
                    this.get('tileViews').push(newTileView);
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
            else if (typeof x === 'string') {
                return this.get('tiles')[x];
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