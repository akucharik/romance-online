define(function() {

    var constants = {
        
        canvas: {
            height: 720,
            width: 1080
        },
        
        character: {
            attributeMax: 100
        },
        
        grid: {
            focusedTileBorderWidth: 2,
            focusedTileFillStyle: 'rgba(255, 100, 100, 1.0)',
            focusedTileIndent: 6,
            pathFillStyle: 'rgba(255, 200, 100, 0.5)',
            selectedTileFillStyle: 'rgba(255, 200, 100, 1.0)',
            tileIndent: 4,
            tileSize: 72
        },
        
        tile: {
            type: {
                normal: 1,
                obstacle: 2
            }
        }
        
    }
    
	return constants;
});