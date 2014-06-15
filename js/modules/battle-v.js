define([
    'backbone',
    'modules/character-m',
    'modules/character-c',
    'modules/constants',
    'modules/grid-m',
    'modules/grid-v',
    'modules/pathfinder',
    'modules/stateManager-m',
    'modules/turn/characterTurn-v',
    'modules/utilities/gameUtilities-m',
    'modules/utilities/gameUtilities-v'
], function (
    Backbone,
    CharacterModel,
    CharacterCollection, 
    constants, 
    GridModel, 
    GridView,
    Pathfinder,
    StateManagerModel,
    CharacterTurnView,
    GameUtilitiesModel, 
    GameUtilitiesView
) {

	var BattleView = Backbone.View.extend({
        
		initialize: function() {

            // set up game utilities
            this.gameUtilities = new GameUtilitiesModel();
            this.gameUtilitiesView = new GameUtilitiesView({ 
                model: this.gameUtilities,
                el: '#gameUtilities'
            });
            
            // set up grid
            this.grid = new GridModel();
            this.gridView = new GridView({
                model: this.grid,
                el: '#background'
            });
            
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
            this.model.set('characters', new CharacterCollection([this.character1, this.character2], {model: CharacterModel}));
            this.model.set('characterTurnCharacter', this.model.get('characters').at(0)),
            
            // set up additional models
            this.pathfinder = new Pathfinder(this.grid);
            this.stateManager = new StateManagerModel();
            
            // set up additional views
            this.characterTurnView = new CharacterTurnView({
                model: this.model,
                el: '#characterActionsMenu'
            });
            
            // set up foreground
            this.foreground = document.querySelector('#foreground');
            this.$foreground = $(this.foreground);
            this.foregroundCtx = this.foreground.getContext('2d');
            this.foreground.width = constants.canvas.WIDTH;
            this.foreground.height = constants.canvas.HEIGHT;
            
            // set up initial properties
            this.model.set('selectedTile', this.model.get('characterTurnCharacter').get('currentTile'));
            
            // set up events
            this.listenTo(this.model, 'change:characterTurnPrimaryAction', this.onCharacterTurnPrimaryActionChange);
            this.listenTo(this.model, 'change:characterTurnCharacter', this.onTurnChange);
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
		
		events: {
            'mousemove': 'onMouseMove',
            'mouseout': 'onMouseOut'
		},
        
        // TODO: refactor this so that the absolute battleView reference isn't necessary
        onMoveComplete: function () {
            Battle.battleView.model.set('characterTurnMovementRange', Battle.battleView.pathfinder.findPaths(Battle.battleView.model.get('characterTurnCharacter')));
            Battle.battleView.model.set('selectedTile', Battle.battleView.model.get('characterTurnCharacter').get('currentTile'));
        },
        
        onFocusedTileChange: function () {
            var focusedTile = this.model.get('focusedTile');
            if (!focusedTile || !this.pathfinder.isTileInRange(focusedTile)) {
                this.model.set('characterTurnPath', []);
            }
            else if (focusedTile.isMoveable()) {
                this.model.set('characterTurnPath', this.pathfinder.nodesInRange[focusedTile.id].path);
            }
        },
        
        onMouseMove: function (event) {
            this.model.set('focusedTile', this.gridView.hitTest(event, this.foreground));
        },
        
        onMouseOut: function (event) {
            // remove mousemove triggered visuals when mouse is not over canvas
            this.model.set('focusedTile', null);
            this.model.set('characterTurnPath', []);
        },
        
        onTurnChange: function () {
            this.model.set('selectedTile', this.model.get('characterTurnCharacter').get('currentTile'));
        },
        
        onCharacterTurnMoveClick: function () {
            if (this.model.get('characterTurnCharacter').get('movementRange') > 0 && this.pathfinder.isTileInRange(this.model.get('focusedTile'))) {
                this.model.set('selectedTile', null);
                this.model.set('characterTurnPath', []);
                this.model.get('characterTurnCharacter').moveTo(this.pathfinder.nodesInRange[this.model.get('focusedTile').id] , this.onMoveComplete);
            }
        },
        
        onCharacterTurnPrimaryActionChange: function () {
            delete this.events.click;
            this.delegateEvents();
            this.stopListening(this.model, 'change:focusedTile');
            
            switch (this.model.get('characterTurnPrimaryAction')) {
                case constants.characterTurn.primaryAction.ATTACK:
                    console.log('Attack');
                    this.model.set('characterTurnMovementRange', {});
                    break;
                case constants.characterTurn.primaryAction.END_TURN:
                    console.log('End turn');
                    this.model.get('characterTurnCharacter').reset();
                    this.model.resetCharacterTurn();
                    if(this.model.get('characters').indexOf(this.model.get('characterTurnCharacter')) < this.model.get('characters').length - 1) {
                        this.model.set('characterTurnCharacter', this.model.get('characters').at(this.model.get('characters').indexOf(this.model.get('characterTurnCharacter')) + 1));
                    }
                    else {
                        this.model.set('characterTurnCharacter', this.model.get('characters').at(0));
                    }
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    console.log('move');
                    this.events['click'] = 'onCharacterTurnMoveClick';
                    this.delegateEvents();
                    this.listenTo(this.model, 'change:focusedTile', this.onFocusedTileChange);
                    this.model.set('characterTurnMovementRange', this.pathfinder.findPaths(this.model.get('characterTurnCharacter')));
                    break;
                case constants.characterTurn.primaryAction.TACTIC:
                    console.log('Tactic');
                    this.model.set('characterTurnMovementRange', {});
                    break;
                case constants.characterTurn.primaryAction.WAIT:
                    console.log('Wait');
                    this.model.set('characterTurnMovementRange', {});
                    break;
            }
        },

        update: function (deltaFrameTime) {
            
        },
        
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
            }
        },
        
        renderCharacter: function (canvasCtx) {
            this.model.get('characters').forEach(function (e, i) {
                var spriteWidth = 16;
                var spriteHeight = 25;
                canvasCtx.drawImage(e.get('spritesheet'), e.get('spriteX'), e.get('spriteY'), spriteWidth, spriteHeight, e.get('x') - spriteWidth, e.get('y') - spriteHeight, spriteWidth*2, spriteHeight*2);
            });
        },
        
        renderPaths: function (paths, canvasCtx) {
            for (var iPath = 0; iPath < paths.length; iPath++) {
                if (paths[iPath].length > 0) {
                    var path = paths[iPath];
                    for (var iTile = 0; iTile < path.length; iTile++) {
                        canvasCtx.strokeStyle = constants.grid.PATH_BORDER_FILL_STYLE;
                        canvasCtx.lineWidth = constants.grid.PATH_BORDER_WIDTH;
                        this.drawTile(path[iTile], canvasCtx, constants.grid.PATH_INDENT);
                        canvasCtx.stroke();
                        
                        canvasCtx.strokeStyle = constants.grid.PATH_OUTER_BORDER_FILL_STYLE;
                        canvasCtx.lineWidth = constants.grid.PATH_OUTER_BORDER_WIDTH;
                        this.drawTile(path[iTile], canvasCtx, constants.grid.PATH_OUTER_BORDER_INDENT);
                        canvasCtx.stroke();
                    };
                }
            };
        },

        renderFocusedTile: function (tile, canvasCtx) {
            if (tile !== null && tile !== undefined) {
                canvasCtx.strokeStyle = constants.grid.FOCUSED_BORDER_FILL_STYLE;
                canvasCtx.lineWidth = constants.grid.FOCUSED_BORDER_WIDTH;
                this.drawTile(tile, canvasCtx, constants.grid.FOCUSED_INDENT);
                canvasCtx.stroke();
                
                canvasCtx.strokeStyle = constants.grid.FOCUSED_OUTER_BORDER_FILL_STYLE;
                canvasCtx.lineWidth = constants.grid.FOCUSED_OUTER_BORDER_WIDTH;
                this.drawTile(tile, canvasCtx, constants.grid.FOCUSED_OUTER_BORDER_INDENT);
                canvasCtx.stroke();
            }
        },
        
        renderMovement: function (tiles, canvasCtx) {
            if (tiles) {
                for (var i in tiles) {
                    canvasCtx.strokeStyle = constants.grid.RANGE_BORDER_FILL_STYLE;
                    canvasCtx.lineWidth = constants.grid.RANGE_BORDER_WIDTH;
                    this.drawTile(tiles[i], canvasCtx, constants.grid.RANGE_INDENT);
                    canvasCtx.stroke();
                    
                    canvasCtx.strokeStyle = constants.grid.RANGE_OUTER_BORDER_FILL_STYLE;
                    canvasCtx.lineWidth = constants.grid.RANGE_OUTER_BORDER_WIDTH;
                    this.drawTile(tiles[i], canvasCtx, constants.grid.RANGE_OUTER_BORDER_INDENT);
                    canvasCtx.stroke();
                }
            }
        },

        renderSelectedTile: function (tile, canvasCtx) {
            //TODO: research if should use "!== undefined" or "typeof x !== 'undefined'"
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
            if (tile !== null && tile !== undefined) {
                canvasCtx.fillStyle = constants.grid.SELECTED_FILL_STYLE;
                canvasCtx.strokeStyle = constants.grid.SELECTED_BORDER_FILL_STYLE;
                canvasCtx.lineWidth = constants.grid.SELECTED_BORDER_WIDTH;
                this.drawTile(tile, canvasCtx, constants.grid.SELECTED_INDENT);
                canvasCtx.fill();
                canvasCtx.stroke();
            }
        },

        render: function () {
            this.foregroundCtx.clearRect(0, 0, constants.canvas.WIDTH, constants.canvas.HEIGHT);
            this.renderSelectedTile(this.model.get('selectedTile'), this.foregroundCtx);
            this.renderMovement(this.model.get('characterTurnMovementRange'), this.foregroundCtx);
            this.renderPaths([this.model.get('characterTurnPath')], this.foregroundCtx);
            this.renderFocusedTile(this.model.get('focusedTile'), this.foregroundCtx);
            this.renderCharacter(this.foregroundCtx);
            
            return this;
        },

        // TODO: Possibly refactor renderer into a standalone object
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