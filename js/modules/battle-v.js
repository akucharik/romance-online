define([
	'jquery',
    'backbone',
    'modules/battle-m',
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
    battle,
    characters, 
    constants, 
    grid, 
    pathfinder, 
    Position, 
    stateManager, 
    stateManagerView, 
    utilities, 
    utilitiesView) {

	var BattleView = Backbone.View.extend({
		el: '#foreground',
		
		initialize: function() {
            
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
            
            characters.addCharacter({x: 205, y: 486}).setStartPosition(grid.get('tiles')[2][2]);
            characters.addCharacter({x: 313, y: 143}).setStartPosition(grid.get('tiles')[10][3]);
            stateManager.set('currentTurnCharacter', characters.at(0));
            grid.set('selectedTile', stateManager.get('currentTurnCharacter').get('currentTile'));
            
            // set up events
            this.listenTo(grid, 'change:focusedTile', this.onFocusedTileChange);
            
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
            
        onMouseMove: function (event) {
            grid.set('focusedTile', grid.hitTest(event, battle.get('background')));
        },
        
        onMouseOut: function (event) {
            // remove mousemove triggered visuals when mouse is not over canvas
            grid.set('focusedTile', null);
            pathfinder.clearPath();
        },
        
        onFocusedTileChange: function () {
            if (grid.get('focusedTile') !== null && grid.get('focusedTile').isMoveable()) {
                pathfinder.findPath(grid.get('focusedTile'), stateManager.get('currentTurnCharacter'));
            }
            else {
                pathfinder.clearPath();
            }
        },
        
        
        
        


        update: function (deltaFrameTime) {
            
        },
        
        renderCharacter: function (canvasCtx) {
            characters.forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('sprite').x, e.get('sprite').y, spriteWidth, spriteHeight, e.get('position').x - spriteWidth, e.get('position').y - spriteHeight, spriteWidth*2, spriteHeight*2);
            });
        },

        renderGrid: function (canvasCtx) {
            for (var x = 0; x < grid.get('tiles').length; x++) {
                for(var y = 0; y < grid.get('tiles')[x].length; y++) {
                    grid.drawTile(grid.get('tiles')[x][y], canvasCtx, constants.grid.tileIndent);
                    canvasCtx.fillStyle = grid.get('tiles')[x][y].type === constants.tile.type.obstacle ? 'rgba(100, 100, 100, 1.0)' : 'rgba(200, 200, 200, 1.0)';
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
            battle.get('foregroundCtx').clearRect(0, 0, constants.canvas.width, constants.canvas.height);
            this.renderSelectedTile(grid.get('selectedTile'), battle.get('foregroundCtx'));
            this.renderPaths([pathfinder.path, stateManager.get('currentTurnCharacter').get('path')], battle.get('foregroundCtx'));
            this.renderFocusedTile(grid.get('focusedTile'), battle.get('foregroundCtx'));
            this.renderCharacter(battle.get('foregroundCtx'));
        },

        // TODO: Possbily refactor renderer into a standalone object
        buildFrame: function () {
            utilities.frameRate.set('currentTime', Date.now());
            var deltaFrameTime = (utilities.frameRate.get('currentTime') - utilities.frameRate.get('lastCalledTime')) / 1000;
            utilities.frameRate.logFrameRate(utilities.frameRate.calculateCurrentFrameRate());
            utilities.frameRate.setAverageFrameRate();
            utilities.frameRate.set('lastCalledTime', utilities.frameRate.get('currentTime'));
            utilities.gameTime.setGameTime(deltaFrameTime);

            battle.battleView.update(deltaFrameTime);
            battle.battleView.render();
            requestAnimationFrame(battle.battleView.buildFrame);
        }
        
	});
    
	return new BattleView();
});