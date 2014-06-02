define(function() {

    var constants = {
        
        canvas: {
//            height: 720,
//            width: 1080
            height: 504,
            width: 720
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
        
        stateManager: {
            characterMovementRange: {
                empty: {}
            },
            turnAction: {
                attack: 1,
                endTurn: 2,
                move: 3,
                tactic: 4,
                wait: 5
            }
        },
        
        tile: {
            movementValue: {
                base: 1,
                tree: 3
            },
            type: {
                base: 1,
                obstacle: 2,
                tree: 3
            }
        }
        
    }
    
	return constants;
});