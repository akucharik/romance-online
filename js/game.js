define([
	'jquery',
    'modules/character-m',
	'modules/characterBattle-v',
    'modules/utilities-m',
    'modules/utilities-v'
    
], function($, CharacterModel, CharacterBattleView, UtilitiesModel, UtilitiesView) {
    
    if(!window.Battle) {
        window.Battle = {};
    }
    // TODO: Eventually remove this. Used to expose models for testing/development.
    Battle.Characters = CharacterModel;
    Battle.Utilities = UtilitiesModel;
    CharacterModel.addCharacter("Freddy");
    
    
    
    
    
var battlefield = (function () {

	var	mouse = {
		pageX: null,
		pageY: null
	};
	
	var	grid = {
		focusedTile: null,
		previousFocusedTile: null,
		rows: [],
		selectedTile: null,
		tileIndent: 4,
		tileSize: 72
	};

	// canvas properties
	var canvasWidth = 1080;
	var canvasHeight = 720;
	var background = null;
	var backgroundCtx = null;
	var foreground = null;
	var foregroundCtx = null;
	
	var createCharacter = function () {
		battlefield.character = {
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
			
			// TODO: determine path, set possible path, set path, tile changed sets possible path, tile clicked sets path and calls "move"
			determinePath: function (endTile) {
				// TODO: stateTile is hard-coded for a specific character, refactor
				var startTile = battlefield.character.currentTile;
				var path = [];
				
				for (i = 0; i < battlefield.character.movementRange; i++) {
					var deltaTileCol = startTile.col - endTile.col;
					var deltaTileRow = startTile.row - endTile.row;
					
					// default the target position to the current position
					var targetRow = startTile.row;
					var targetCol = startTile.col;	
					
					// determine tile to step to
					if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
						if (deltaTileRow < 0) {
							targetRow = startTile.row + 1;
						}
						if (deltaTileRow > 0) {
							targetRow = startTile.row - 1;
						}
					}
					if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
						if (deltaTileCol < 0) {
							targetCol = startTile.col + 1;
						}
						if (deltaTileCol > 0) {
							targetCol = startTile.col - 1;
						}
					}
					startTile = battlefield.grid.rows[targetRow][targetCol];
					path.push(startTile);
					
					// end path if destination does not use all movement points
					if (startTile.row === endTile.row && startTile.col === endTile.col) {
						break;
					}
				}

				return path;
			},
			
			setPossiblePath: function (tile) {
				battlefield.character.possiblePath = battlefield.character.determinePath(tile);
			},
			
			setPath: function (endTile) {
				battlefield.character.path = battlefield.character.possiblePath;
			},
			
			tileIsInPath: function (tile) {
				var matchFound = false;
				for (i = 0; i < battlefield.character.path.length; i++) {
					if (tile === battlefield.character.path[i]) {
						matchFound = true;
					}
				};
				return matchFound;
			},
			
			currentTile: null,
			movementRange: 7,
			possiblePath: null,
			path: null,
			spritesheet: document.getElementById('spritesheet'),
			targetTile: null,
			targetX: null,
			targetY: null,
			velocity: 200,
			x: null,
			y: null,
			setStartPosition: function (tile) {
				battlefield.character.currentTile = tile;
				battlefield.character.x = battlefield.character.currentTile.x + grid.tileSize/2;
				battlefield.character.y = battlefield.character.currentTile.y + grid.tileSize/2;
			}
		};
		battlefield.character.setStartPosition(battlefield.grid.rows[2][2]);
	};
	
	
	var init = function () {
		// init background canvas
		background = document.getElementById('background');
		backgroundCtx = background.getContext('2d');
		background.width = canvasWidth;
		background.height = canvasHeight;
		createGrid();
		renderGrid(backgroundCtx);
		
		// init foreground canvas
		foreground = document.getElementById('foreground');
		foregroundCtx = foreground.getContext('2d');
		foreground.width = canvasWidth;
		foreground.height = canvasHeight;
		createCharacter();
		
		// start rendering engine
		requestAnimationFrame(renderCanvas);
		
		// set event handlers
		$(document).on('mousemove', function (event) { 
			if (event.target.id === foreground.id) {
				trackMouse(event);
			}
			else {
				mouse.pageX = null;
				mouse.pageY = null;
				// remove focused tile if mouse is no over canvas
				grid.focusedTile = null;
			}
		});
		
		//foreground.addEventListener('click', canvasClick, false);
		$(foreground).on('click', canvasClick);
	};
	
	var canvasClick = function (event) {
		selectTile(event);
		battlefield.character.setPath();
		if (battlefield.character.tileIsInPath(grid.selectedTile)) {
			battlefield.character.move();
		}
	}
	
	var selectTile = function (event) {
		grid.selectedTile = grid.focusedTile;
	};
	
	var trackMouse = function (event) {
		mouse.pageX = event.pageX;
		mouse.pageY = event.pageY;
		grid.previousFocusedTile = grid.focusedTile;
		grid.focusedTile = hitTest(event);
		if (grid.previousFocusedTile !== grid.focusedTile) {
			//TODO: figure out how to pass in a callback function (learn about creating a custom event)
			focusedTileChanged();
		}
	};
	
	//TODO: figure out how to better handle listening to a "focused tile changed" event
	var focusedTileChanged = function () {
		battlefield.character.setPossiblePath(grid.focusedTile);
	}
	
	
	
	
	
	var hitTest = function (mouseObj) {		
		var backgroundX = mouseObj.pageX - $(background).offset().left;
		var backgroundY = mouseObj.pageY - $(background).offset().top;
		var row = Math.floor(backgroundY / grid.tileSize);
		var col = Math.floor(backgroundX / grid.tileSize);
		return grid.rows[row][col];
		
		// TODO: only needed for non-square/rectangle tile shapes
		//drawTile(tile, foregroundCtx)
		//if(foregroundCtx.isPointInPath(backgroundX, backgroundY)) {
		//	return tile;
		//}
		//else {
		//	return null;	
		//}
	};
	
	var drawTile = function (tile, canvasCtx, indentValue) {
		if (tile !== undefined && tile !== null) {
			var indent = (!indentValue ? 0 : indentValue);
			canvasCtx.beginPath();
			canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, grid.tileSize - indent, grid.tileSize - indent);
		}
	};
	
	// create and save grid tiles for future use
	var createGrid = function () {
	    var numTilesX = (canvasWidth - (canvasWidth % grid.tileSize)) / grid.tileSize;
	    var numTilesY = (canvasHeight - (canvasHeight % grid.tileSize)) / grid.tileSize;
	    var tilePositionX = 0;
	    var tilePositionY = 0;
		
		for (var iRow = 0; iRow < numTilesY; iRow++) {
			grid.rows[iRow] = [];
			tilePositionX = 0;
			for (var iCol = 0; iCol < numTilesX; iCol++) {
				tile = {
					'x': tilePositionX,
					'y': tilePositionY,
					'row': iRow,
					'col': iCol
				};
				grid.rows[iRow].push(tile);
				tilePositionX += grid.tileSize;
			};
			tilePositionY += grid.tileSize;
		};
	};

	
	
	
	
	
	
	
	var renderCharacter = function (canvasCtx) {
		var spriteWidth = 16;
		var spriteHeight = 22;
		canvasCtx.drawImage(battlefield.character.spritesheet, 205, 487, spriteWidth, spriteHeight, battlefield.character.x - spriteWidth, battlefield.character.y - spriteHeight, spriteWidth*2, spriteHeight*2);
	};
	
	var renderGrid = function (canvasCtx) {
		canvasCtx.fillStyle = 'rgba(200, 200, 200, 1.0)';
		
		for (var iRow = 0; iRow < grid.rows.length; iRow++) {
			for(var iTile = 0; iTile < grid.rows[iRow].length; iTile++) {
				drawTile(grid.rows[iRow][iTile], canvasCtx, grid.tileIndent);
				canvasCtx.fill();
			};
		};
	};
	
	var renderCharacterPath = function (tile, canvasCtx) {
		if (tile !== undefined && tile!== null && battlefield.character.possiblePath.length > 0) {
			path = battlefield.character.possiblePath;
			// render path only if focused tile is within movement range
			if (tile.row === path[path.length - 1].row && tile.col === path[path.length - 1].col) {
				canvasCtx.fillStyle = 'rgba(255, 200, 100, 0.5)';
				for (i = 0; i < path.length; i++)
				{
					drawTile(path[i], canvasCtx, 2);
					canvasCtx.fill();
				}
			}
		}
		//else {
		//	alert("No destination tile was provided to display the character's path.");
		//}
	};
	
	var renderFocusedTile = function (tile, canvasCtx) {
		if (tile !== null && tile !== undefined) {
			canvasCtx.strokeStyle = 'rgba(255, 100, 100, 1.0)';
			canvasCtx.lineWidth = 2;
			drawTile(tile, canvasCtx, 2);
			canvasCtx.stroke();	
		}
	};
	
	var renderSelectedTile = function (tile, canvasCtx) {
		if (tile !== null && tile !== undefined) {
			canvasCtx.fillStyle = 'rgba(255, 200, 100, 1.0)';
			drawTile(tile, canvasCtx, grid.tileIndent);
			canvasCtx.fill();
		}
	};
	
	//var updateEntities = function () {
	//		
	//};
	
	var update = function (deltaFrameTime) {
		//updateEntities(deltaFrameTime);
	};
	
	var render = function () {
		foregroundCtx.clearRect(0, 0, canvasWidth, canvasHeight);
		renderSelectedTile(grid.selectedTile, foregroundCtx);
		renderCharacterPath(grid.focusedTile, foregroundCtx);
		renderFocusedTile(grid.focusedTile, foregroundCtx);
		renderCharacter(foregroundCtx);
	};
	
	var renderCanvas = function () {
        UtilitiesModel.FrameRate.set('currentTime', Date.now());
        var deltaFrameTime = (UtilitiesModel.FrameRate.get('currentTime') - UtilitiesModel.FrameRate.get('lastCalledTime')) / 1000;
        UtilitiesModel.FrameRate.logFrameRate(UtilitiesModel.FrameRate.calculateCurrentFrameRate());
        UtilitiesModel.FrameRate.setAverageFrameRate();
        UtilitiesModel.FrameRate.set('lastCalledTime', UtilitiesModel.FrameRate.get('currentTime'));
        UtilitiesModel.GameTime.setGameTime(deltaFrameTime);
        
		update(deltaFrameTime);
		render();
		requestAnimationFrame(renderCanvas);
	};
	
	return {
		init: init,
		grid: grid
	};
	
}());
    
    
    
    
    battlefield.init();
        
});