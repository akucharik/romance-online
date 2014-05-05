define([
	'jquery',
    'backbone',
    'modules/character-m',
    'modules/constants',
    'modules/grid-m',
    'modules/pathfinder',
    'modules/position',
    'modules/stateManager-m',
    'modules/stateManager-v',
    'modules/utilities-m',
    'modules/utilities-v'
], function (
    $, 
    Backbone, 
    characters, 
    constants, 
    grid, 
    pathfinder, 
    Position, 
    stateManager, 
    stateManagerView, 
    utilities, 
    utilitiesView) {

    var engine = {

        canvas: {
            background: null,
            backgroundCtx: null,
            foreground: null,
            foregroundCtx: null
        },
        
        events: _.extend(Backbone.Events),

        mouse: {
            position: new Position(null, null)
        },

        init: function () {
            // initialize background
            this.canvas.background = document.getElementById('background');
            this.canvas.backgroundCtx = background.getContext('2d');
            this.canvas.background.width = constants.canvas.width;
            this.canvas.background.height = constants.canvas.height;
            this.renderGrid(this.canvas.backgroundCtx);
            
            // initialize foreground
            this.canvas.foreground = document.getElementById('foreground');
            this.canvas.foregroundCtx = foreground.getContext('2d');
            this.canvas.foreground.width = constants.canvas.width;
            this.canvas.foreground.height = constants.canvas.height;
            characters.addCharacter({x: 205, y: 486}).setStartPosition(grid.get('tiles')[2][2]);
            characters.addCharacter({x: 313, y: 143}).setStartPosition(grid.get('tiles')[10][3]);
            stateManager.set('currentTurnCharacter', characters.at(0));
            grid.set('selectedTile', stateManager.get('currentTurnCharacter').get('currentTile'));
            
            // start rendering engine
            requestAnimationFrame(this.buildGameFrame);

            // set up events
            this.events.onCanvasClick = function (event) {
                grid.set('selectedTile', grid.get('focusedTile'));
                if (pathfinder.isTileInPath(grid.get('selectedTile'))) {
                    pathfinder.selectPath(stateManager.get('currentTurnCharacter'));
                    stateManager.get('currentTurnCharacter').move();
                }
            },
            
            this.events.onFocusedTileChange = function () {
                if (grid.get('focusedTile') !== null) {
                    pathfinder.findPath(grid.get('focusedTile'), stateManager.get('currentTurnCharacter'));
                }
            },
            
            this.events.onMouseMove = function (event) {
                if (event.target.id === engine.canvas.foreground.id) {
                    engine.mouse.position.x = event.pageX;
                    engine.mouse.position.y = event.pageY;
                    grid.set('focusedTile', grid.hitTest(event, engine.canvas.background));
                }
                else {
                    engine.mouse.position.x = null;
                    engine.mouse.position.y = null;
                    // remove mousemove triggered visuals when mouse is not over canvas
                    grid.set('focusedTile', null);
                    pathfinder.clearPath();
                }
            },
            
            $(document).on('mousemove', engine.events.onMouseMove);

            $(this.canvas.foreground).on('click', engine.events.onCanvasClick);
            
            this.events.listenTo(grid, 'change:focusedTile', engine.events.onFocusedTileChange);
            
        },
        




        //var updateEntities = function () {
        //		
        //};

        update: function (deltaFrameTime) {
            //updateEntities(deltaFrameTime);
        },
        
        
        
        
        
        renderCharacter: function (canvasCtx) {
            characters.forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('sprite').x, e.get('sprite').y, spriteWidth, spriteHeight, e.get('position').x - spriteWidth, e.get('position').y - spriteHeight, spriteWidth*2, spriteHeight*2);
            });
        },

        renderGrid: function (canvasCtx) {
            canvasCtx.fillStyle = 'rgba(200, 200, 200, 1.0)';

            for (var x = 0; x < grid.get('tiles').length; x++) {
                for(var y = 0; y < grid.get('tiles')[x].length; y++) {
                    grid.drawTile(grid.get('tiles')[x][y], canvasCtx, constants.grid.tileIndent);
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
                        grid.drawTile(path[iTile], canvasCtx, constants.grid.tileIndent);
                        canvasCtx.fill();
                    };
                }
            };
        },

        renderFocusedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.strokeStyle = constants.grid.focusedTileFillStyle;
                canvasCtx.lineWidth = constants.grid.focusedTileBorderWidth;
                grid.drawTile(tile, canvasCtx, constants.grid.focusedTileIndent);
                canvasCtx.stroke();	
            }
        },

        renderSelectedTile: function (tile, canvasCtx) {
            //TODO: research if should use "!== undefined" or "typeof x !== 'undefined'"
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
            if (tile !== null && tile !== undefined) {
                canvasCtx.fillStyle = constants.grid.selectedTileFillStyle;
                grid.drawTile(tile, canvasCtx, constants.grid.tileIndent);
                canvasCtx.fill();
            }
        },

        render: function () {
            this.canvas.foregroundCtx.clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(grid.get('selectedTile'), this.canvas.foregroundCtx);
            this.renderPaths([pathfinder.path, stateManager.get('currentTurnCharacter').get('path')], this.canvas.foregroundCtx);
            this.renderFocusedTile(grid.get('focusedTile'), this.canvas.foregroundCtx);
            this.renderCharacter(this.canvas.foregroundCtx);
        },

        buildGameFrame: function () {
            utilities.frameRate.set('currentTime', Date.now());
            var deltaFrameTime = (utilities.frameRate.get('currentTime') - utilities.frameRate.get('lastCalledTime')) / 1000;
            utilities.frameRate.logFrameRate(utilities.frameRate.calculateCurrentFrameRate());
            utilities.frameRate.setAverageFrameRate();
            utilities.frameRate.set('lastCalledTime', utilities.frameRate.get('currentTime'));
            utilities.gameTime.setGameTime(deltaFrameTime);

            engine.update(deltaFrameTime);
            engine.render();
            requestAnimationFrame(engine.buildGameFrame);
        }
    };

    return engine;
    
});