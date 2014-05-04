define([
	'jquery',
    'backbone',
    'modules/character-m',
    'modules/constants',
    'modules/pathfinder',
    'modules/position',
    'modules/tile',
    'modules/utilities-m',
    'modules/utilities-v'
], function($, Backbone, characterList, constants, Pathfinder, Position, Tile, UtilitiesModel, UtilitiesView) {

    var engine = {

        canvas: {
            background: null,
            backgroundCtx: null,
            foreground: null,
            foregroundCtx: null,
            height: 720,
            width: 1080
        },
        
        grid: {
            focusedTile: null,
            previousFocusedTile: null,
            selectedTile: null,
            tiles: [],
            tileIndent: constants.grid.tileIndent,
            tileSize: constants.grid.tileSize
        },

        mouse: {
            position: new Position(null, null)
        },
        
        pathfinder: {},
        
        state: {
            currentTurn: {
                character: null
            }
        },

        init: function () {
            // init background canvas
            this.canvas.background = document.getElementById('background');
            this.canvas.backgroundCtx = background.getContext('2d');
            this.canvas.background.width = this.canvas.width;
            this.canvas.background.height = this.canvas.height;
            this.createGrid();
            this.renderGrid(this.canvas.backgroundCtx);
            
            characterList.addCharacter({x: 205, y: 486}).setStartPosition(this.grid.tiles[2][2]);
            characterList.addCharacter({x: 313, y: 143}).setStartPosition(this.grid.tiles[10][3]);
            this.state.currentTurn.character = characterList.at(0);
            engine.grid.selectedTile = engine.state.currentTurn.character.get('currentTile');

            // init foreground canvas
            this.canvas.foreground = document.getElementById('foreground');
            this.canvas.foregroundCtx = foreground.getContext('2d');
            this.canvas.foreground.width = this.canvas.width;
            this.canvas.foreground.height = this.canvas.height;

            this.pathfinder = new Pathfinder(this.grid.tiles);
            
            // start rendering engine
            requestAnimationFrame(this.buildGameFrame);

            // set event handlers
            $(document).on('mousemove', function (event) { 
                if (event.target.id === engine.canvas.foreground.id) {
                    engine.trackMouse(event);
                }
                else {
                    //TODO: wrap in a function call like 'clearMouse()'
                    engine.mouse.position.x = null;
                    engine.mouse.position.y = null;
                    // remove mousemove triggered visuals when mouse is not over canvas
                    engine.grid.focusedTile = null;
                    engine.pathfinder.clearPath();
                }
            });

            //foreground.addEventListener('click', canvasClick, false);
            $(this.canvas.foreground).on('click', this.canvasClick);
            
            $('#endTurn').on('click', function () {
                if(characterList.indexOf(engine.state.currentTurn.character) < characterList.length - 1) {
                    engine.state.currentTurn.character = characterList.at(characterList.indexOf(engine.state.currentTurn.character) + 1);
                }
                else {
                    engine.state.currentTurn.character = characterList.at(0);
                }
                engine.grid.selectedTile = engine.state.currentTurn.character.get('currentTile');
            });
        },

        canvasClick: function (event) {
            engine.selectTile(event);
            if (engine.pathfinder.isTileInPath(engine.grid.selectedTile)) {
                engine.pathfinder.selectPath(engine.state.currentTurn.character);
                engine.state.currentTurn.character.move();
            }
        },

        trackMouse: function (event) {
            this.mouse.position.x = event.pageX;
            this.mouse.position.y = event.pageY;
            this.grid.previousFocusedTile = this.grid.focusedTile;
            this.grid.focusedTile = this.hitTest(event);
            if (this.grid.previousFocusedTile !== this.grid.focusedTile) {
                //TODO: figure out how to pass in a callback function (learn about creating a custom event)
                this.focusedTileChanged();
            }
        },
        
        
        
        
        
        selectTile: function (event) {
            this.grid.selectedTile = this.grid.focusedTile;
        },
        
        //TODO: figure out how to better handle listening to a "focused tile changed" event
        focusedTileChanged: function () {
            this.pathfinder.findPath(this.grid.focusedTile, this.state.currentTurn.character);
        },

        hitTest: function (mouseObj) {		
            var backgroundX = mouseObj.pageX - $(this.canvas.background).offset().left;
            var backgroundY = mouseObj.pageY - $(this.canvas.background).offset().top;
            
            // handle sub-pixel centering of game if it happens
            backgroundX = (backgroundX < 0) ? 0 : backgroundX;
            backgroundX = (backgroundX > this.canvas.width) ? this.canvas.width : backgroundX;
            
            var x = Math.floor(backgroundX / this.grid.tileSize);
            var y = Math.floor(backgroundY / this.grid.tileSize);

            return this.grid.tiles[x][y];

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
                canvasCtx.rect(tile.position.x + indent/2, tile.position.y + indent/2, this.grid.tileSize - indent, this.grid.tileSize - indent);
            }
        },

        // create and save grid tiles for future use
        createGrid: function () {
            var tilesX = (this.canvas.width - (this.canvas.width % this.grid.tileSize)) / this.grid.tileSize;
            var tilesY = (this.canvas.height - (this.canvas.height % this.grid.tileSize)) / this.grid.tileSize;

            for (var x = 0; x < tilesX; x++) {
                this.grid.tiles[x] = [];
                for (var y = 0; y < tilesY; y++) {
                    var newTile = new Tile(x, y, false);
                    this.grid.tiles[x].push(newTile);
                };
            };
        },





        //var updateEntities = function () {
        //		
        //};

        update: function (deltaFrameTime) {
            //updateEntities(deltaFrameTime);
        },
        
        
        
        
        
        renderCharacter: function (canvasCtx) {
            characterList.forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('sprite').x, e.get('sprite').y, spriteWidth, spriteHeight, e.get('position').x - spriteWidth, e.get('position').y - spriteHeight, spriteWidth*2, spriteHeight*2);
                //canvasCtx.drawImage(e.get('spritesheet'), 205, 487, spriteWidth, spriteHeight, e.get('position').x - spriteWidth, e.get('position').y - spriteHeight, spriteWidth*2, spriteHeight*2);
            });
        },

        renderGrid: function (canvasCtx) {
            canvasCtx.fillStyle = 'rgba(200, 200, 200, 1.0)';

            for (var x = 0; x < this.grid.tiles.length; x++) {
                for(var y = 0; y < this.grid.tiles[x].length; y++) {
                    this.drawTile(this.grid.tiles[x][y], canvasCtx, this.grid.tileIndent);
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

        render: function () {
            this.canvas.foregroundCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderSelectedTile(this.grid.selectedTile, this.canvas.foregroundCtx);
            this.renderPaths([this.pathfinder.path, this.state.currentTurn.character.get('path')], this.canvas.foregroundCtx);
            this.renderFocusedTile(this.grid.focusedTile, this.canvas.foregroundCtx);
            this.renderCharacter(this.canvas.foregroundCtx);
        },

        buildGameFrame: function () {
            UtilitiesModel.FrameRate.set('currentTime', Date.now());
            var deltaFrameTime = (UtilitiesModel.FrameRate.get('currentTime') - UtilitiesModel.FrameRate.get('lastCalledTime')) / 1000;
            UtilitiesModel.FrameRate.logFrameRate(UtilitiesModel.FrameRate.calculateCurrentFrameRate());
            UtilitiesModel.FrameRate.setAverageFrameRate();
            UtilitiesModel.FrameRate.set('lastCalledTime', UtilitiesModel.FrameRate.get('currentTime'));
            UtilitiesModel.GameTime.setGameTime(deltaFrameTime);

            engine.update(deltaFrameTime);
            engine.render();
            requestAnimationFrame(engine.buildGameFrame);
        }
    };

    return engine;
    
});