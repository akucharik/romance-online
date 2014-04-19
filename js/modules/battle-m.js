define([
	'backbone'
], function(Backbone) {

    var Canvas = Backbone.Model.extend({
        defaults: {
            height: 720,
            $background: null,
            background: null,
            backgroundCtx: null,
            $foreground: null,
            foreground: null,
            foregroundCtx: null,
            width: 1080
        }
    });
    
    var Grid = Backbone.Model.extend({
        defaults: {
            focusedTile: null,
            rows: [],
            selectedTile: null,
            tileIndent: 4,
            tileSize: 72
        }
    });
    
    
	var Battle = Backbone.Model.extend({
		defaults: {
			canvas: new Canvas(),
            grid: new Grid(),
            mouse: {
                pageX: null,
		        pageY: null
            }
		},
        
        
        // create and save grid tiles for future use
        createGrid: function () {
            var canvas = this.get('canvas');
            var grid = this.get('grid');
            
            var numTilesX = (canvas.get('width') - (canvas.get('width') % grid.get('tileSize'))) / grid.get('tileSize');
            var numTilesY = (canvas.get('height') - (canvas.get('height') % grid.get('tileSize'))) / grid.get('tileSize');
            var tilePositionX = 0;
            var tilePositionY = 0;

            for (var iRow = 0; iRow < numTilesY; iRow++) {
                grid.get('rows')[iRow] = [];
                tilePositionX = 0;
                for (var iCol = 0; iCol < numTilesX; iCol++) {
                    var tile = {
                        'x': tilePositionX,
                        'y': tilePositionY,
                        'row': iRow,
                        'col': iCol
                    };
                    grid.get('rows')[iRow].push(tile);
                    tilePositionX += grid.get('tileSize');
                };
                tilePositionY += grid.get('tileSize');
            };
        },
        
        hitTest: function (event) {
            var canvas = this.get('canvas');
            var grid = this.get('grid');
        
            var backgroundX = event.pageX - canvas.get('$background').offset().left;
            var backgroundY = event.pageY - canvas.get('$background').offset().top;
            var row = Math.floor(backgroundY / grid.get('tileSize'));
            var col = Math.floor(backgroundX / grid.get('tileSize'));
            
            return grid.get('rows')[row][col];

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
	
	return new Battle();
});