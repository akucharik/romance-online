define([
	'jquery',
    'backbone',
    'modules/character-m',
    'modules/constants',
    'modules/grid-m',
    'modules/pathfinder',
    'modules/stateManager-m',
    'modules/turn/characterTurn-v',
    'modules/utilities/gameUtilities-m',
    'modules/utilities/gameUtilities-v'
], function (
    $, 
    Backbone,
    characters, 
    constants, 
    grid, 
    pathfinder,
    StateManagerModel, 
    CharacterTurnView,
    GameUtilitiesModel, 
    GameUtilitiesView
) {

	var BattleView = Backbone.View.extend({
        // background
        background: null,
        $background: null,
        backgroundCtx: null,
        
        // foreground
        foreground: null,
        $foreground: null,
        foregroundCtx: null,
        
        // models
        gameUtilitiesModel: null,
        stateManagerModel:  null,
        
        // views
        characterTurnView: null,
        gameUtilitiesView: null,
        
		initialize: function() {
            // set up models
            this.gameUtilitiesModel = new GameUtilitiesModel();
            this.stateManagerModel = new StateManagerModel();

            // set up views
            this.characterTurnView = new CharacterTurnView({
                model: this.stateManagerModel,
                el: '#characterActionsMenu'
            });
            this.gameUtilitiesView = new GameUtilitiesView({ 
                model: this.gameUtilitiesModel,
                el: '#gameUtilities'
            });
            
            // set up background
            this.background = document.querySelector('#background');
            this.$background = $(this.background);
            this.backgroundCtx = this.background.getContext('2d');
            this.background.width = constants.canvas.width;
            this.background.height = constants.canvas.height;
            this.renderGrid(this.backgroundCtx);

            // set up foreground
            this.foreground = document.querySelector('#foreground');
            this.$foreground = $(this.foreground);
            this.foregroundCtx = this.foreground.getContext('2d');
            this.foreground.width = constants.canvas.width;
            this.foreground.height = constants.canvas.height;

            // set up events
            this.listenTo(this.stateManagerModel, 'change:currentTurnCharacter', this.onTurnChange);
            this.listenTo(grid, 'change:focusedTile', this.onFocusedTileChange);
            
            // set up state
            characters.addCharacter({x: 205, y: 486}).setStartPosition(grid.getTile(1, 1));
            characters.addCharacter({x: 313, y: 143}).setStartPosition(grid.getTile(3, 2));
            this.stateManagerModel.set('currentTurnCharacter', characters.at(0));
            grid.set('selectedTile', this.stateManagerModel.get('currentTurnCharacter').get('currentTile'));
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
		
		events: {
			'click': 'onClick',
            'mousemove': 'onMouseMove',
            'mouseout': 'onMouseOut'
		},
        
        onClick: function (event) {
            grid.set('selectedTile', grid.get('focusedTile'));
            if (pathfinder.isTileInPath(grid.get('selectedTile'))) {
                pathfinder.selectPath(this.stateManagerModel.get('currentTurnCharacter'));
                this.stateManagerModel.get('currentTurnCharacter').move();
            }
        },
        
        onFocusedTileChange: function () {
            var focusedTile = grid.get('focusedTile');
            if (!focusedTile) {
                pathfinder.clearPath();
            }
            else if (focusedTile.isMoveable()) {
                pathfinder.findPath(focusedTile, this.stateManagerModel.get('currentTurnCharacter'));
            }
        },
        
        onMouseMove: function (event) {
            grid.set('focusedTile', grid.hitTest(event, this.background));
        },
        
        onMouseOut: function (event) {
            // remove mousemove triggered visuals when mouse is not over canvas
            grid.set('focusedTile', null);
            pathfinder.clearPath();
        },
        
        onTurnChange: function () {
            grid.set('selectedTile', this.stateManagerModel.get('currentTurnCharacter').get('currentTile'));
        },
        
        
        
        
        


        update: function (deltaFrameTime) {
            
        },
        
        renderCharacter: function (canvasCtx) {
            characters.forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('sprite').x, e.get('sprite').y, spriteWidth, spriteHeight, e.get('x') - spriteWidth, e.get('y') - spriteHeight, spriteWidth*2, spriteHeight*2);
            });
        },

        renderGrid: function (canvasCtx) {
            var getFillStyle = function (type) {
                switch (type) {
                    case constants.tile.type.obstacle:
                        return 'rgba(100, 100, 100, 1.0)';
                    case constants.tile.type.tree:
                        return 'rgba(50, 150, 50, 1.0)';
                    default:
                        return 'rgba(100, 200, 100, 1.0)';
                }
            };
            
            for (var i in grid.get('tiles')) {
                grid.drawTile(grid.get('tiles')[i], canvasCtx, constants.grid.tileIndent);
                canvasCtx.fillStyle = getFillStyle(grid.get('tiles')[i].type);
                canvasCtx.fill();
                
                canvasCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
                canvasCtx.font = "10px Arial";
                canvasCtx.fillText(i, grid.get('tiles')[i].x + 6 , grid.get('tiles')[i].y + 15);
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
        
        renderMovement: function (tiles, canvasCtx) {
            if (tiles) {
                canvasCtx.fillStyle = constants.grid.pathFillStyle;
                for (var i in tiles) {
                    grid.drawTile(tiles[i], canvasCtx, constants.grid.tileIndent);
                    canvasCtx.fill();
                }
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
            this.foregroundCtx.clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(grid.get('selectedTile'), this.foregroundCtx);
            this.renderMovement(this.stateManagerModel.get('characterMovementRange'), this.foregroundCtx);
            this.renderPaths([pathfinder.path, this.stateManagerModel.get('currentTurnCharacter').get('path')], this.foregroundCtx);
            this.renderFocusedTile(grid.get('focusedTile'), this.foregroundCtx);
            this.renderCharacter(this.foregroundCtx);
        },

        // TODO: Possbily refactor renderer into a standalone object
        // TODO: Don't like absolute gameUtilities calls are referenced due to requestAnimationFrame being on the window object
        buildFrame: function () {
            Battle.battleView.gameUtilitiesModel.time.set('previousFrameTime', Battle.battleView.gameUtilitiesModel.time.get('currentFrameTime'));
            Battle.battleView.gameUtilitiesModel.time.set('currentFrameTime', Date.now());
            Battle.battleView.gameUtilitiesModel.time.set('deltaFrameTime', Battle.battleView.gameUtilitiesView.gameTime.calculateDeltaFrameTime());
            Battle.battleView.gameUtilitiesModel.time.set('gameTime', Battle.battleView.gameUtilitiesModel.time.get('gameTime') + Battle.battleView.gameUtilitiesModel.time.get('deltaFrameTime'));
            Battle.battleView.update(Battle.battleView.gameUtilitiesModel.time.get('deltaFrameTime'));
            Battle.battleView.render();
            window.requestAnimationFrame(Battle.battleView.buildFrame);
        }
        
	});
    
	return BattleView;
});