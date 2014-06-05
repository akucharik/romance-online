define([
	'jquery',
    'backbone',
    'modules/character-m',
    'modules/character-c',
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
    CharacterModel,
    CharacterCollection, 
    constants, 
    Grid, 
    Pathfinder,
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
        gameUtilities: null,
        grid: null,
        pathfinder: null,
        stateManager:  null,
        
        // collections
        characters: null,
        
        // views
        characterTurnView: null,
        gameUtilitiesView: null,
        
		initialize: function() {
            
            // set up background
            this.background = document.querySelector('#background');
            this.$background = $(this.background);
            this.backgroundCtx = this.background.getContext('2d');
            this.background.width = constants.canvas.width;
            this.background.height = constants.canvas.height;

            // set up foreground
            this.foreground = document.querySelector('#foreground');
            this.$foreground = $(this.foreground);
            this.foregroundCtx = this.foreground.getContext('2d');
            this.foreground.width = constants.canvas.width;
            this.foreground.height = constants.canvas.height;

            // set up grid
            this.grid = new Grid();
            this.renderGrid(this.backgroundCtx);
            
            // set up characters
            this.character1 = new CharacterModel({
                spriteX: 205,
                spriteY: 486
            });
            this.character1.setStartPosition(this.grid.getTile(1, 1));
            this.character2 = new CharacterModel({
                spriteX: 313,
                spriteY: 143
            });
            this.character2.setStartPosition(this.grid.getTile(3, 2));
            this.characters = new CharacterCollection([this.character1, this.character2], {model: CharacterModel});
            console.log(this.characters);
            
            // set up models
            this.gameUtilities = new GameUtilitiesModel();
            this.stateManager = new StateManagerModel({
                characters: this.characters,
                turnCharacter: this.characters.at(0),
            });
            
            this.pathfinder = new Pathfinder(this.grid);
            this.grid.set('selectedTile', this.stateManager.get('turnCharacter').get('currentTile'));
            
            // set up views
            this.characterTurnView = new CharacterTurnView({
                model: this.stateManager,
                el: '#characterActionsMenu',
                pathfinder: this.pathfinder
            });
            this.gameUtilitiesView = new GameUtilitiesView({ 
                model: this.gameUtilities,
                el: '#gameUtilities'
            });
            
            // set up events
            this.listenTo(this.stateManager, 'change:turnAction', this.onTurnActionChange);
            this.listenTo(this.stateManager, 'change:turnCharacter', this.onTurnChange);
            //this.listenTo(grid, 'change:focusedTile', this.onFocusedTileChange);
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
		
		events: {
			'click': 'onClick',
            'mousemove': 'onMouseMove',
            'mouseout': 'onMouseOut'
		},
        
        onClick: function (event) {
            this.grid.set('selectedTile', this.grid.get('focusedTile'));
            if (this.pathfinder.isTileInPath(this.grid.get('selectedTile'))) {
                this.pathfinder.selectPath(this.stateManager.get('turnCharacter'));
                this.stateManager.get('turnCharacter').move();
            }
        },
        
        onFocusedTileChange: function () {
            var focusedTile = this.grid.get('focusedTile');
            if (!focusedTile) {
                this.pathfinder.clearPath();
            }
            else if (focusedTile.isMoveable()) {
                this.pathfinder.findPath(focusedTile, this.stateManager.get('turnCharacter'));
            }
        },
        
        onMouseMove: function (event) {
            this.grid.set('focusedTile', this.grid.hitTest(event, this.background));
        },
        
        onMouseOut: function (event) {
            // remove mousemove triggered visuals when mouse is not over canvas
            this.grid.set('focusedTile', null);
            this.pathfinder.clearPath();
        },
        
        onTurnChange: function () {
            this.grid.set('selectedTile', this.stateManager.get('turnCharacter').get('currentTile'));
        },
        
        onTurnActionChange: function () {
            this.stopListening(this.grid, 'change:focusedTile');
            
            switch (this.stateManager.get('turnAction')) {
                case constants.stateManager.turnAction.attack:
                    
                    break;
                case constants.stateManager.turnAction.endTurn:
                    
                    break;
                case constants.stateManager.turnAction.move:
                    this.listenTo(this.grid, 'change:focusedTile', this.onFocusedTileChange);
                    break;
                case constants.stateManager.turnAction.tactic:
                    
                    break;
                case constants.stateManager.turnAction.wait:
                    
                    break;
            }
        },
        
        
        


        update: function (deltaFrameTime) {
            
        },
        
        renderCharacter: function (canvasCtx) {
            this.stateManager.get('characters').forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('spriteX'), e.get('spriteY'), spriteWidth, spriteHeight, e.get('x') - spriteWidth, e.get('y') - spriteHeight, spriteWidth*2, spriteHeight*2);
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
            
            for (var i in this.grid.get('tiles')) {
                this.grid.drawTile(this.grid.get('tiles')[i], canvasCtx, constants.grid.tileIndent);
                canvasCtx.fillStyle = getFillStyle(this.grid.get('tiles')[i].type);
                canvasCtx.fill();
                
                canvasCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
                canvasCtx.font = "10px Arial";
                canvasCtx.fillText(i, this.grid.get('tiles')[i].x + 6 , this.grid.get('tiles')[i].y + 15);
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
        
        renderMovement: function (tiles, canvasCtx) {
            if (tiles) {
                canvasCtx.fillStyle = constants.grid.pathFillStyle;
                for (var i in tiles) {
                    this.grid.drawTile(tiles[i], canvasCtx, constants.grid.tileIndent);
                    canvasCtx.fill();
                }
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
            this.foregroundCtx.clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(this.grid.get('selectedTile'), this.foregroundCtx);
            this.renderMovement(this.stateManager.get('characterMovementRange'), this.foregroundCtx);
            this.renderPaths([this.pathfinder.path, this.stateManager.get('turnCharacter').get('path')], this.foregroundCtx);
            this.renderFocusedTile(this.grid.get('focusedTile'), this.foregroundCtx);
            this.renderCharacter(this.foregroundCtx);
        },

        // TODO: Possbily refactor renderer into a standalone object
        // TODO: Don't like absolute gameUtilities calls are referenced due to requestAnimationFrame being on the window object
        buildFrame: function () {
            Battle.battleView.gameUtilities.time.set('previousFrameTime', Battle.battleView.gameUtilities.time.get('currentFrameTime'));
            Battle.battleView.gameUtilities.time.set('currentFrameTime', Date.now());
            Battle.battleView.gameUtilities.time.set('deltaFrameTime', Battle.battleView.gameUtilitiesView.gameTime.calculateDeltaFrameTime());
            Battle.battleView.gameUtilities.time.set('gameTime', Battle.battleView.gameUtilities.time.get('gameTime') + Battle.battleView.gameUtilities.time.get('deltaFrameTime'));
            Battle.battleView.update(Battle.battleView.gameUtilities.time.get('deltaFrameTime'));
            Battle.battleView.render();
            window.requestAnimationFrame(Battle.battleView.buildFrame);
        }
        
	});
    
	return BattleView;
});