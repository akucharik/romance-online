define(function() {

    var constants = {
        
        canvas: {
//            height: 720,
//            width: 1080
            HEIGHT: 504,
            WIDTH: 720
        },
        
        character: {
            ATTRIBUTE_MAX: 100
        },
        
        grid: {
            FOCUSED_BORDER_FILL_STYLE: 'rgba(255, 255, 50, 1.0)',
            FOCUSED_BORDER_WIDTH: 2,
            FOCUSED_INDENT: 6,
            FOCUSED_OUTER_BORDER_FILL_STYLE: 'rgba(0, 0, 0, 0.3)',
            FOCUSED_OUTER_BORDER_INDENT: 3,
            FOCUSED_OUTER_BORDER_WIDTH: 1,
            
            PATH_BORDER_FILL_STYLE: 'rgba(255, 255, 50, 1.0)',
            PATH_BORDER_WIDTH: 2,
            PATH_INDENT: 6,
            PATH_OUTER_BORDER_FILL_STYLE: 'rgba(0, 0, 0, 0.3)',
            PATH_OUTER_BORDER_INDENT: 3,
            PATH_OUTER_BORDER_WIDTH: 1,
            
            RANGE_BORDER_FILL_STYLE:  'rgba(255, 255, 255, 0.8)',
            RANGE_BORDER_WIDTH: 2,
            RANGE_INDENT: 6,
            RANGE_OUTER_BORDER_FILL_STYLE: 'rgba(0, 0, 0, 0.3)',
            RANGE_OUTER_BORDER_INDENT: 3,
            RANGE_OUTER_BORDER_WIDTH: 1,
            
            SELECTED_BORDER_FILL_STYLE: 'rgba(0, 0, 0, 0.3)',
            SELECTED_BORDER_WIDTH: 1,
            SELECTED_FILL_STYLE: 'rgba(255, 255, 50, 0.5)',
            SELECTED_INDENT: 3,
            
            TILE_SIZE: 72
        },
        
        characterTurn: {
            primaryAction: {
                ATTACK: 1,
                END_TURN: 2,
                MOVE: 3,
                TACTIC: 4,
                WAIT: 5
            }
        },
        
        tile: {
            cost: {
                BASE: 1,
                OBSTACLE: 100,
                TREE: 3
            },
            type: {
                BASE: 1,
                OBSTACLE: 2,
                TREE: 3
            }
        },
        
        home: {
            state: {
                MAIN_MENU: 1,
                GAMES: 2,
                CHARACTERS: 3
            }
        }
        
    }
    
	return constants;
});