define([
	'jquery',
    'backbone',
    'modules/character-m',
    'modules/constants',
    'modules/grid-m',
    'modules/pathfinder',
    'modules/position',
    'modules/utilities-m',
    'modules/utilities-v'
], function($, Backbone, characters, constants, Grid, Pathfinder, Position, utilities, utilitiesView) {

    var engine = {

        canvas: {
            background: null,
            backgroundCtx: null,
            foreground: null,
            foregroundCtx: null
        },
        
        events: _.extend(Backbone.Events),
        
        grid: null,

        mouse: {
            position: new Position(null, null)
        },
        
        pathfinder: null,
        
        state: {
            currentTurn: {
                character: null
            }
        },

        init: function () {
            // init background
            this.canvas.background = document.getElementById('background');
            this.canvas.backgroundCtx = background.getContext('2d');
            this.canvas.background.width = constants.canvas.width;
            this.canvas.background.height = constants.canvas.height;
            this.grid = new Grid();
            this.renderGrid(this.canvas.backgroundCtx);
            
            // init foreground
            this.canvas.foreground = document.getElementById('foreground');
            this.canvas.foregroundCtx = foreground.getContext('2d');
            this.canvas.foreground.width = constants.canvas.width;
            this.canvas.foreground.height = constants.canvas.height;
            characters.addCharacter({x: 205, y: 486}).setStartPosition(this.grid.get('tiles')[2][2]);
            characters.addCharacter({x: 313, y: 143}).setStartPosition(this.grid.get('tiles')[10][3]);
            this.state.currentTurn.character = characters.at(0);
            engine.grid.set('selectedTile', engine.state.currentTurn.character.get('currentTile'));
            this.pathfinder = new Pathfinder(this.grid.get('tiles'));
            
            // start rendering engine
            requestAnimationFrame(this.buildGameFrame);

            // set up events
            this.events.canvasClicked = function (event) {
                engine.grid.set('selectedTile', engine.grid.get('focusedTile'));
                if (engine.pathfinder.isTileInPath(engine.grid.get('selectedTile'))) {
                    engine.pathfinder.selectPath(engine.state.currentTurn.character);
                    engine.state.currentTurn.character.move();
                }
            },
            
            this.events.focusedTileChanged = function () {
                if (engine.grid.get('focusedTile') !== null) {
                    engine.pathfinder.findPath(engine.grid.get('focusedTile'), engine.state.currentTurn.character);
                }
            },
            
            this.events.mouseMoved = function (event) {
                if (event.target.id === engine.canvas.foreground.id) {
                    engine.mouse.position.x = event.pageX;
                    engine.mouse.position.y = event.pageY;
                    engine.grid.set('focusedTile', engine.grid.hitTest(event, engine.canvas.background));
                }
                else {
                    engine.mouse.position.x = null;
                    engine.mouse.position.y = null;
                    // remove mousemove triggered visuals when mouse is not over canvas
                    engine.grid.set('focusedTile', null);
                    engine.pathfinder.clearPath();
                }
            },
            
            $(document).on('mousemove', engine.events.mouseMoved);

            $(this.canvas.foreground).on('click', engine.events.canvasClicked);
            
            this.events.listenTo(engine.grid, 'change:focusedTile', engine.events.focusedTileChanged);
            
            $('#endTurn').on('click', function () {
                if(characters.indexOf(engine.state.currentTurn.character) < characters.length - 1) {
                    engine.state.currentTurn.character = characters.at(characters.indexOf(engine.state.currentTurn.character) + 1);
                }
                else {
                    engine.state.currentTurn.character = characters.at(0);
                }
                engine.grid.selectedTile = engine.state.currentTurn.character.get('currentTile');
            });
            
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

            for (var x = 0; x < this.grid.get('tiles').length; x++) {
                for(var y = 0; y < this.grid.get('tiles')[x].length; y++) {
                    this.grid.drawTile(this.grid.get('tiles')[x][y], canvasCtx, constants.grid.tileIndent);
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
                        this.grid.drawTile(path[iTile], canvasCtx, constants.grid.tileIndent);
                        canvasCtx.fill();
                    };
                }
            };
        },

        renderFocusedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.strokeStyle = constants.grid.focusedTileFillStyle;
                canvasCtx.lineWidth = constants.grid.focusedTileBorderWidth;
                this.grid.drawTile(tile, canvasCtx, constants.grid.focusedTileIndent);
                canvasCtx.stroke();	
            }
        },

        renderSelectedTile: function (tile, canvasCtx) {
            //TODO: research if should use "!== undefined" or "typeof x !== 'undefined'"
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
            if (tile !== null && tile !== undefined) {
                canvasCtx.fillStyle = constants.grid.selectedTileFillStyle;
                this.grid.drawTile(tile, canvasCtx, constants.grid.tileIndent);
                canvasCtx.fill();
            }
        },

        render: function () {
            this.canvas.foregroundCtx.clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(this.grid.get('selectedTile'), this.canvas.foregroundCtx);
            this.renderPaths([this.pathfinder.path, this.state.currentTurn.character.get('path')], this.canvas.foregroundCtx);
            this.renderFocusedTile(this.grid.get('focusedTile'), this.canvas.foregroundCtx);
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