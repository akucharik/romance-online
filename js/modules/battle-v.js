define([
	'jquery',
    'backbone',
    'modules/battle-m',
    'modules/character-m',
    'modules/constants',
    'modules/grid-m',
    'modules/pathfinder',
    'modules/stateManager-m',
    'modules/stateManager-v',
    'modules/utilities/gameUtilities-m',
    'modules/utilities/gameUtilities-v'
], function (
    $, 
    Backbone,
    battle,
    characters, 
    constants, 
    grid, 
    pathfinder,
    stateManager, 
    stateManagerView, 
    GameUtilitiesModel, 
    GameUtilitiesView) {

	var BattleView = Backbone.View.extend({
		el: '#foreground',
        characterMovementRange: {},
        gameUtilities: {},
        gameUtilitiesView: {},
        
		initialize: function() {
            
            this.gameUtilitiesModel = new GameUtilitiesModel();
            this.gameUtilitiesView = new GameUtilitiesView({ 
                model: this.gameUtilitiesModel,
                el: '#gameUtilities'
            });
            
            // init background
            battle.set('background', document.getElementById('background'));
            battle.set('$background', $(battle.get('background')));
            battle.set('backgroundCtx', battle.get('background').getContext('2d'));
            battle.get('background').width = constants.canvas.width;
            battle.get('background').height = constants.canvas.height;
            this.renderGrid(battle.get('backgroundCtx'));

            // init foreground
            battle.set('foreground', document.getElementById('foreground'));
            battle.set('$foreground', $(battle.get('foreground')));
            battle.set('foregroundCtx', battle.get('foreground').getContext('2d'));
            battle.get('foreground').width = constants.canvas.width;
            battle.get('foreground').height = constants.canvas.height;

            // set up events
            this.listenTo(stateManager, 'change:currentTurnCharacter', this.onTurnChange);
            this.listenTo(grid, 'change:focusedTile', this.onFocusedTileChange);
            
            // set up state
            characters.addCharacter({x: 205, y: 486}).setStartPosition(grid.getTile(1, 1));
            characters.addCharacter({x: 313, y: 143}).setStartPosition(grid.getTile(3, 2));
            stateManager.set('currentTurnCharacter', characters.at(0));
            grid.set('selectedTile', stateManager.get('currentTurnCharacter').get('currentTile'));
            
            // start rendering engine
            requestAnimationFrame(this.buildFrame);
		},
		
		events: {
			'click': 'onClick',
            'mousemove': 'onMouseMove',
            'mouseout': 'onMouseOut'
		},
        
        onClick: function (event) {
            grid.set('selectedTile', grid.get('focusedTile'));
            if (pathfinder.isTileInPath(grid.get('selectedTile'))) {
                pathfinder.selectPath(stateManager.get('currentTurnCharacter'));
                stateManager.get('currentTurnCharacter').move();
            }
        },
        
        onFocusedTileChange: function () {
            var focusedTile = grid.get('focusedTile');
            if (!focusedTile) {
                pathfinder.clearPath();
            }
            else if (focusedTile.isMoveable()) {
                //pathfinder.findRange(stateManager.get('currentTurnCharacter'));
                pathfinder.findPath(focusedTile, stateManager.get('currentTurnCharacter'));
            }
        },
        
        onMouseMove: function (event) {
            grid.set('focusedTile', grid.hitTest(event, battle.get('background')));
        },
        
        onMouseOut: function (event) {
            // remove mousemove triggered visuals when mouse is not over canvas
            grid.set('focusedTile', null);
            pathfinder.clearPath();
        },
        
        onTurnChange: function () {
            this.characterMovementRange = pathfinder.findRange(stateManager.get('currentTurnCharacter'));
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
            //console.log('render movement tiles: ', tiles);
            if (tiles) {
                canvasCtx.fillStyle = constants.grid.pathFillStyle;
                for (var i in tiles) {
                    //console.log('render tile: ', i);
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
            battle.get('foregroundCtx').clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(grid.get('selectedTile'), battle.get('foregroundCtx'));
            this.renderMovement(this.characterMovementRange, battle.get('foregroundCtx'));
            this.renderPaths([pathfinder.path, stateManager.get('currentTurnCharacter').get('path')], battle.get('foregroundCtx'));
            this.renderFocusedTile(grid.get('focusedTile'), battle.get('foregroundCtx'));
            this.renderCharacter(battle.get('foregroundCtx'));
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
            requestAnimationFrame(Battle.battleView.buildFrame);
        }
        
	});
    
	return new BattleView();
});