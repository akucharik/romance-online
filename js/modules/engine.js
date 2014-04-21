define([
	'jquery',
    'modules/constants',
    'modules/utilities-m',
    'modules/utilities-v',
    'modules/tile'
], function($, constants, UtilitiesModel, UtilitiesView, Tile) {

    var engine = {

        mouse: {
            pageX: null,
            pageY: null
        },

        grid: {
            focusedTile: null,
            previousFocusedTile: null,
            rows: [],
            selectedTile: null,
            tileIndent: constants.grid.tileIndent,
            tileSize: constants.grid.tileSize
        },

        // canvas properties
        canvasWidth: 1080,
        canvasHeight: 720,
        background: null,
        backgroundCtx: null,
        foreground: null,
        foregroundCtx: null,
        
        character: {
            move: function () {
                var stepTimer = null;

                var stepTo = function (tile) {

                    var targetX = tile.x + engine.grid.tileSize/2;
                    var targetY = tile.y + engine.grid.tileSize/2;
                    var increment = 6;
                    
                    // move left
                    if (engine.character.x > targetX) {
                        increment = Math.abs(increment) * -1;
                        engine.character.x += increment;
                        if (engine.character.x <= targetX) {
                            engine.character.x = targetX;
                        }
                    }

                    // move right
                    if (engine.character.x < targetX) {
                        increment = Math.abs(increment);
                        engine.character.x += increment;
                        if (engine.character.x >= targetX) {
                            engine.character.x = targetX;
                        }
                    }

                    // move up
                    if (engine.character.y > targetY) {
                        increment = Math.abs(increment) * -1;
                        engine.character.y += increment;
                        if (engine.character.y <= targetY) {
                            engine.character.y = targetY;
                        }
                    }

                    // move down
                    if (engine.character.y < targetY) {
                        increment = Math.abs(increment);
                        engine.character.y += increment;
                        if (engine.character.y >= targetY) {
                            engine.character.y = targetY;
                        }
                    }

                    if (engine.character.x === targetX && engine.character.y === targetY) {
                        clearInterval(stepTimer);
                        engine.character.currentTile = tile;
                        engine.character.path.shift();
                        // recursive: move to next tile in path
                        engine.character.move();
                    }

                };

                // step to the first tile in the path
                if (this.path.length > 0) {
                    console.log('stepTo: ', this.path[0]);
                    self = this;
                    stepTimer = setInterval(function () {
                        stepTo(self.path[0]);
                    }, 16);
                }
            },

            currentTile: null,
            movementRange: 7,
            path: [],
            spritesheet: document.getElementById('spritesheet'),
            velocity: 200,
            x: null,
            y: null,
            setStartPosition: function (tile) {
                this.currentTile = tile;
                this.x = this.currentTile.x + engine.grid.tileSize/2;
                this.y = this.currentTile.y + engine.grid.tileSize/2;
            }
        },
        
        pathfinder: {
            path: [],
            
            findPath: function (endTile, character) {
                var currentTile = character.currentTile;
                var newPath = [];

                for (i = 0; i < character.movementRange; i++) {
                    var deltaTileCol = currentTile.col - endTile.col;
                    var deltaTileRow = currentTile.row - endTile.row;
                    
                    // default the next position to the current position
                    var nextTile = {
                        row: currentTile.row,
                        col: currentTile.col
                    }

                    // determine next tile to step to
                    if (Math.abs(deltaTileRow) >= Math.abs(deltaTileCol)) {
                        if (deltaTileRow < 0) {
                            nextTile.row++;
                        }
                        if (deltaTileRow > 0) {
                            nextTile.row--;
                        }
                    }
                    if (Math.abs(deltaTileCol) > Math.abs(deltaTileRow)) {
                        if (deltaTileCol < 0) {
                            nextTile.col++;
                        }
                        if (deltaTileCol > 0) {
                            nextTile.col--;
                        }
                    }
                    currentTile = engine.grid.rows[nextTile.row][nextTile.col];
                    newPath.push(currentTile);

                    // end path
                    //TODO: when tile is refactored into its own object, make an "isEqual" method that compares itself to another tile
                    if (currentTile.row === endTile.row && currentTile.col === endTile.col) {
                        break;
                    }
                }
                
                //TODO: when tile is refactored into its own object, make an "isEqual" method that compares itself to another tile
                // only set the path if the focused tile is in range
                if (endTile.row === newPath[newPath.length - 1].row && endTile.col === newPath[newPath.length - 1].col) {
                    this.path = newPath;
                }
                else { 
                    this.path = [];
                }
            },

            selectPath: function (character) {
                character.path = this.path.slice();
                this.path = [];
            },

            tileIsInPath: function (tile, character) {
                var matchFound = false;
                for (i = 0; i < this.path.length; i++) {
                    if (tile === this.path[i]) {
                        matchFound = true;
                    }
                };
                return matchFound;
            }
        },


        init: function () {
            // init background canvas
            this.background = document.getElementById('background');
            this.backgroundCtx = background.getContext('2d');
            this.background.width = this.canvasWidth;
            this.background.height = this.canvasHeight;
            this.createGrid();
            this.renderGrid(this.backgroundCtx);
            this.character.setStartPosition(this.grid.rows[2][2]);

            // init foreground canvas
            this.foreground = document.getElementById('foreground');
            this.foregroundCtx = foreground.getContext('2d');
            this.foreground.width = this.canvasWidth;
            this.foreground.height = this.canvasHeight;

            // start rendering engine
            requestAnimationFrame(this.renderCanvas);

            // set event handlers
            $(document).on('mousemove', function (event) { 
                if (event.target.id === engine.foreground.id) {
                    engine.trackMouse(event);
                }
                else {
                    //TODO: wrap in a function call like 'clearMouse()'
                    engine.mouse.pageX = null;
                    engine.mouse.pageY = null;
                    // remove focused tile if mouse is not over canvas
                    engine.grid.focusedTile = null;
                }
            });

            //foreground.addEventListener('click', canvasClick, false);
            $(foreground).on('click', this.canvasClick);
        },

        canvasClick: function (event) {
            engine.selectTile(event);
            if (engine.pathfinder.tileIsInPath(engine.grid.selectedTile, engine.character)) {
                engine.pathfinder.selectPath(engine.character);
                engine.character.move();
            }
        },

        selectTile: function (event) {
            this.grid.selectedTile = this.grid.focusedTile;
        },

        trackMouse: function (event) {
            this.mouse.pageX = event.pageX;
            this.mouse.pageY = event.pageY;
            this.grid.previousFocusedTile = this.grid.focusedTile;
            this.grid.focusedTile = this.hitTest(event);
            if (this.grid.previousFocusedTile !== this.grid.focusedTile) {
                //TODO: figure out how to pass in a callback function (learn about creating a custom event)
                this.focusedTileChanged();
            }
        },

        //TODO: figure out how to better handle listening to a "focused tile changed" event
        focusedTileChanged: function () {
            this.pathfinder.findPath(this.grid.focusedTile, this.character);
        },





        hitTest: function (mouseObj) {		
            var backgroundX = mouseObj.pageX - $(this.background).offset().left;
            var backgroundY = mouseObj.pageY - $(this.background).offset().top;
            var row = Math.floor(backgroundY / this.grid.tileSize);
            var col = Math.floor(backgroundX / this.grid.tileSize);
            return this.grid.rows[row][col];

            // TODO: only needed for non-square/rectangle tile shapes
            //drawTile(tile, foregroundCtx)
            //if(foregroundCtx.isPointInPath(backgroundX, backgroundY)) {
            //	return tile;
            //}
            //else {
            //	return null;	
            //}
        },

        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, this.grid.tileSize - indent, this.grid.tileSize - indent);
            }
        },

        // create and save grid tiles for future use
        createGrid: function () {
            var numTilesX = (this.canvasWidth - (this.canvasWidth % this.grid.tileSize)) / this.grid.tileSize;
            var numTilesY = (this.canvasHeight - (this.canvasHeight % this.grid.tileSize)) / this.grid.tileSize;
            var tilePositionX = 0;
            var tilePositionY = 0;

            for (var iRow = 0; iRow < numTilesY; iRow++) {
                this.grid.rows[iRow] = [];
                tilePositionX = 0;
                for (var iCol = 0; iCol < numTilesX; iCol++) {
                    var tile = {
                        'x': tilePositionX,
                        'y': tilePositionY,
                        'row': iRow,
                        'col': iCol
                    };
                    this.grid.rows[iRow].push(tile);
                    tilePositionX += this.grid.tileSize;
                };
                tilePositionY += this.grid.tileSize;
            };
        },








        renderCharacter: function (canvasCtx) {
            var spriteWidth = 16;
            var spriteHeight = 22;
            canvasCtx.drawImage(engine.character.spritesheet, 205, 487, spriteWidth, spriteHeight, engine.character.x - spriteWidth, engine.character.y - spriteHeight, spriteWidth*2, spriteHeight*2);
        },

        renderGrid: function (canvasCtx) {
            canvasCtx.fillStyle = 'rgba(200, 200, 200, 1.0)';

            for (var iRow = 0; iRow < this.grid.rows.length; iRow++) {
                for(var iTile = 0; iTile < this.grid.rows[iRow].length; iTile++) {
                    this.drawTile(this.grid.rows[iRow][iTile], canvasCtx, this.grid.tileIndent);
                    canvasCtx.fill();
                };
            };
        },
        
        renderPaths: function (paths, canvasCtx) {
            canvasCtx.fillStyle = constants.grid.pathFillStyle;
            for (var iPath = 0; iPath < paths.length; iPath++) {
                if (paths[iPath].length > 0) {
                    var path = paths[iPath];
                    for (var iTile = 0; iTile < path.length; iTile++) {
                        this.drawTile(path[iTile], canvasCtx, constants.grid.tileIndent);
                        canvasCtx.fill();
                    };
                }
            };
        },
        

        renderFocusedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.strokeStyle = constants.grid.focusedTileFillStyle;
                canvasCtx.lineWidth = constants.grid.focusedTileBorderWidth;
                this.drawTile(tile, canvasCtx, constants.grid.focusedTileIndent);
                canvasCtx.stroke();	
            }
        },

        renderSelectedTile: function (tile, canvasCtx) {
            //TODO: research if should use "!== undefined" or "typeof x !== 'undefined'"
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
            if (tile !== null && tile !== undefined) {
                canvasCtx.fillStyle = constants.grid.selectedTileFillStyle;
                this.drawTile(tile, canvasCtx, this.grid.tileIndent);
                canvasCtx.fill();
            }
        },

        //var updateEntities = function () {
        //		
        //};

        update: function (deltaFrameTime) {
            //updateEntities(deltaFrameTime);
        },

        render: function () {
            this.foregroundCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.renderSelectedTile(this.grid.selectedTile, this.foregroundCtx);
            this.renderPaths([this.pathfinder.path, this.character.path], this.foregroundCtx);
            this.renderFocusedTile(this.grid.focusedTile, this.foregroundCtx);
            this.renderCharacter(this.foregroundCtx);
        },

        renderCanvas: function () {
            UtilitiesModel.FrameRate.set('currentTime', Date.now());
            var deltaFrameTime = (UtilitiesModel.FrameRate.get('currentTime') - UtilitiesModel.FrameRate.get('lastCalledTime')) / 1000;
            UtilitiesModel.FrameRate.logFrameRate(UtilitiesModel.FrameRate.calculateCurrentFrameRate());
            UtilitiesModel.FrameRate.setAverageFrameRate();
            UtilitiesModel.FrameRate.set('lastCalledTime', UtilitiesModel.FrameRate.get('currentTime'));
            UtilitiesModel.GameTime.setGameTime(deltaFrameTime);

            engine.update(deltaFrameTime);
            engine.render();
            requestAnimationFrame(engine.renderCanvas);
        }
    };

    return engine;
    
});