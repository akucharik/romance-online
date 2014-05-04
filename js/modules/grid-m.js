define([
	'backbone',
    'modules/constants',
    'modules/tile'
], function(Backbone, constants, Tile) {
    
	var Grid = Backbone.Model.extend({
		defaults: {
            focusedTile: null,
            selectedTile: null,
            tiles: [],
		},
        
        initialize: function () {
            var tilesX = (constants.canvas.width - (constants.canvas.width % constants.grid.tileSize)) / constants.grid.tileSize;
            var tilesY = (constants.canvas.height - (constants.canvas.height % constants.grid.tileSize)) / constants.grid.tileSize;

            for (var x = 0; x < tilesX; x++) {
                this.get('tiles')[x] = [];
                for (var y = 0; y < tilesY; y++) {
                    var newTile = new Tile(x, y, false);
                    this.get('tiles')[x].push(newTile);
                };
            };
        },
        
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.position.x + indent/2, tile.position.y + indent/2, constants.grid.tileSize - indent, constants.grid.tileSize - indent);
            }
        },
        
        hitTest: function (mouseObj, canvas) {		
            var backgroundX = mouseObj.pageX - $(canvas).offset().left;
            var backgroundY = mouseObj.pageY - $(canvas).offset().top;
            
            // handle sub-pixel centering of game if it happens
            backgroundX = (backgroundX < 0) ? 0 : backgroundX;
            backgroundX = (backgroundX > constants.canvas.width) ? constants.canvas.width : backgroundX;
            
            var x = Math.floor(backgroundX / constants.grid.tileSize);
            var y = Math.floor(backgroundY / constants.grid.tileSize);

            return this.get('tiles')[x][y];

            // TODO: only needed for non-square/rectangle tile shapes
            //drawTile(tile, foregroundCtx)
            //if(foregroundCtx.isPointInPath(backgroundX, backgroundY)) {
            //	return tile;
            //}
            //else {
            //	return null;	
            //}
        }
        
	});
	
	return Grid;
});