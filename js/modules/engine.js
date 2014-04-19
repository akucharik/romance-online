define([
	'jquery',
    'modules/utilities-m',
    'modules/utilities-v'
], function($, UtilitiesModel, UtilitiesView) {

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
            tileIndent: 4,
            tileSize: 72
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
                        if (engine.character.x < targetX) {
                            engine.character.x = targetX;
                        }
                    }

                    // move right
                    if (engine.character.x < targetX) {
                        increment = Math.abs(increment);
                        engine.character.x += increment;
                        if (engine.character.x > targetX) {
                            engine.character.x = targetX;
                        }
                    }

                    // move up
                    if (engine.character.y > targetY) {
                        increment = Math.abs(increment) * -1;
                        engine.character.y += increment;
                        if (engine.character.y < targetY) {
                            engine.character.y = targetY;
                        }
                    }

                    // move down
                    if (engine.character.y < targetY) {
                        increment = Math.abs(increment);
                        engine.character.y += increment;
                        if (engine.character.y > targetY) {
                            engine.character.y = targetY;
                        }
                    }

                    if (engine.character.x === targetX && engine.character.y === targetY) {
                        clearInterval(stepTimer);
                        engine.character.currentTile = tile;
                        // remove recently stepped tile from path
                        engine.character.path.shift();
                        engine.character.possiblePath = engine.character.path;
                        // recursive: move to next tile in path
                        engine.character.move();
                    }

                };

                // step to the first tile in the path
                if (this.path.length > 0) {
                    console.log('stepTo: ', this.path[0]);
                    stepTimer = setInterval(function () {
                        stepTo(this.path[0]);
                    }, 16);
                }
            },

            // TODO: determine path, set possible path, set path, tile changed sets possible path, tile clicked sets path and calls "move"
            determinePath: function (endTile) {
                // TODO: stateTile is hard-coded for a specific character, refactor
                var startTile = this.currentTile;
                var path = [];

                for (i = 0; i < this.movementRange; i++) {
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
                    startTile = engine.grid.rows[targetRow][targetCol];
                    path.push(startTile);

                    // end path if destination does not use all movement points
                    if (startTile.row === endTile.row && startTile.col === endTile.col) {
                        break;
                    }
                }

                return path;
            },

            setPossiblePath: function (tile) {
                this.possiblePath = this.determinePath(tile);
            },

            setPath: function (endTile) {
                this.path = this.possiblePath;
            },

            tileIsInPath: function (tile) {
                var matchFound = false;
                for (i = 0; i < this.path.length; i++) {
                    if (tile === this.path[i]) {
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
                console.log(this);
                this.currentTile = tile;
                this.x = this.currentTile.x + engine.grid.tileSize/2;
                this.y = this.currentTile.y + engine.grid.tileSize/2;
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
                    engine.mouse.pageX = null;
                    engine.mouse.pageY = null;
                    // remove focused tile if mouse is no over canvas
                    engine.grid.focusedTile = null;
                }
            });

            //foreground.addEventListener('click', canvasClick, false);
            $(foreground).on('click', this.canvasClick);
        },

        canvasClick: function (event) {
            engine.selectTile(event);
            engine.character.setPath();
            if (engine.character.tileIsInPath(engine.grid.selectedTile)) {
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
            this.character.setPossiblePath(this.grid.focusedTile);
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
                var indent = (!indentValue ? 0 : indentValue);
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

        renderCharacterPath: function (tile, canvasCtx) {
            if (tile !== undefined && tile!== null && this.character.possiblePath.length > 0) {
                path = this.character.possiblePath;
                // render path only if focused tile is within movement range
                if (tile.row === path[path.length - 1].row && tile.col === path[path.length - 1].col) {
                    canvasCtx.fillStyle = 'rgba(255, 200, 100, 0.5)';
                    for (i = 0; i < path.length; i++)
                    {
                        this.drawTile(path[i], canvasCtx, 2);
                        canvasCtx.fill();
                    }
                }
            }
            //else {
            //	alert("No destination tile was provided to display the character's path.");
            //}
        },

        renderFocusedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.strokeStyle = 'rgba(255, 100, 100, 1.0)';
                canvasCtx.lineWidth = 2;
                this.drawTile(tile, canvasCtx, 2);
                canvasCtx.stroke();	
            }
        },

        renderSelectedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.fillStyle = 'rgba(255, 200, 100, 1.0)';
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
            this.renderCharacterPath(this.grid.focusedTile, this.foregroundCtx);
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