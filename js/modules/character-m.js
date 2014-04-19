define([
	'backbone'
], function(Backbone) {

	var Character = Backbone.Model.extend({
		defaults: {
            attributes: {
                available: 100,
                strength: 0,
                intelligence: 0,
                happiness: 0
            },
            currentTile: null,
			movementRange: 7,
            name: '',
			possiblePath: null,
			path: null,
			spritesheet: document.getElementById('spritesheet'),
			targetTile: null,
			targetX: null,
			targetY: null,
			velocity: 200,
			x: null,
			y: null
		},
        
        
        
		
		addPointToAttribute: function(attr, change) {
			var cur = this.get(attr);
			
			this.set(attr, cur + change);
			// adjust available accordingly.
		},
        
        move: function () {
            var stepTimer = null;

            var stepTo = function (tile) {
                console.log(tile, 'stepTo');

                var targetX = tile.x + grid.tileSize/2;
                var targetY = tile.y + grid.tileSize/2;
                var increment = 6;

                // move left
                if (battlefield.character.x > targetX) {
                    increment = Math.abs(increment) * -1;
                    battlefield.character.x += increment;
                    if (battlefield.character.x < targetX) {
                        battlefield.character.x = targetX;
                    }
                }

                // move right
                if (battlefield.character.x < targetX) {
                    increment = Math.abs(increment);
                    battlefield.character.x += increment;
                    if (battlefield.character.x > targetX) {
                        battlefield.character.x = targetX;
                    }
                }

                // move up
                if (battlefield.character.y > targetY) {
                    increment = Math.abs(increment) * -1;
                    battlefield.character.y += increment;
                    if (battlefield.character.y < targetY) {
                        battlefield.character.y = targetY;
                    }
                }

                // move down
                if (battlefield.character.y < targetY) {
                    increment = Math.abs(increment);
                    battlefield.character.y += increment;
                    if (battlefield.character.y > targetY) {
                        battlefield.character.y = targetY;
                    }
                }

                if (battlefield.character.x === targetX && battlefield.character.y === targetY) {
                    clearInterval(stepTimer);
                    battlefield.character.currentTile = tile;
                    // remove recently stepped tile from path
                    battlefield.character.path.shift();
                    battlefield.character.possiblePath = battlefield.character.path;
                    // recursive: move to next tile in path
                    battlefield.character.move();
                }

            };

            // step to the first tile in the path
            if (battlefield.character.path.length > 0) {
                stepTimer = setInterval(function () {
                    stepTo(battlefield.character.path[0]);
                }, 16);
            }
        },
        
        // "path" should be the current possible path determined by the pathfinder
        setPath: function (path) {
            this.set('path') = path;
        },
        
        
        setStartPosition: function (tile) {
            this.set('currentTile', tile);
            this.set('x', this.get('currentTile').x + grid.tileSize/2);
            battlefield.character.y = battlefield.character.currentTile.y + grid.tileSize/2;
        }
	});
	
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
			
			
//			// TODO: determine path, set possible path, set path, tile changed sets possible path, tile clicked sets path and calls "move"
//			determinePath: function (endTile) {
//				// TODO: stateTile is hard-coded for a specific character, refactor
//				var startTile = battlefield.character.currentTile;
//				var path = [];
//				
//				for (i = 0; i < battlefield.character.movementRange; i++) {
//					var deltaTileCol = startTile.col - endTile.col;
//					var deltaTileRow = startTile.row - endTile.row;
//					
//					// default the target position to the current position
//					var targetRow = startTile.row;
//					var targetCol = startTile.col;	
//					
//					// determine tile to step to
//					if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
//						if (deltaTileRow < 0) {
//							targetRow = startTile.row + 1;
//						}
//						if (deltaTileRow > 0) {
//							targetRow = startTile.row - 1;
//						}
//					}
//					if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
//						if (deltaTileCol < 0) {
//							targetCol = startTile.col + 1;
//						}
//						if (deltaTileCol > 0) {
//							targetCol = startTile.col - 1;
//						}
//					}
//					startTile = battlefield.grid.rows[targetRow][targetCol];
//					path.push(startTile);
//					
//					// end path if destination does not use all movement points
//					if (startTile.row === endTile.row && startTile.col === endTile.col) {
//						break;
//					}
//				}
//
//				return path;
//			},
//			
//			setPossiblePath: function (tile) {
//				battlefield.character.possiblePath = battlefield.character.determinePath(tile);
//			},
//			
//			tileIsInPath: function (tile) {
//				var matchFound = false;
//				for (i = 0; i < battlefield.character.path.length; i++) {
//					if (tile === battlefield.character.path[i]) {
//						matchFound = true;
//					}
//				};
//				return matchFound;
//			},
			
			
		
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
	var CharacterList = Backbone.Collection.extend({
		
		addCharacter: function(name) {
			var character = new Character({
				name: name
			});
			
			this.add(character);
			return character;
		}
		
	});
	
	return new CharacterList();
});