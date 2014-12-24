define([
    'backbone',
    'collections/character',
    'constants',
    'models/character',
    'models/gameUtilities',
    'models/grid',
    'models/pathfinder',
    'models/stateManager',
    'views/character',
    'views/characterTurn',
    'views/gameUtilities',
    'views/grid'
], function (
    Backbone,
    CharacterCollection,
    constants, 
    CharacterModel,
    GameUtilitiesModel, 
    GridModel, 
    Pathfinder,
    StateManagerModel,
    CharacterView,
    CharacterTurnView,
    GameUtilitiesView,
    GridView
) {

	var BattleView = Backbone.View.extend({
        
		initialize: function() {
            // bind function context
            this.onMoveComplete = this.onMoveComplete.bind(this);
            this.buildFrame = this.buildFrame.bind(this);
            
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
                spriteY: 486,
                spriteWidth: 16,
                spriteHeight: 25
            });
            this.character2 = new CharacterModel({
                spriteX: 313,
                spriteY: 143,
                spriteWidth: 16,
                spriteHeight: 25
            });
            this.character1View = new CharacterView({
                model: this.character1,
                tagName: 'canvas',
                parent: this
            });
            this.character2View = new CharacterView({
                model: this.character2,
                tagName: 'canvas',
                parent: this
            });
            
            this.model.set('characters', new CharacterCollection([this.character1, this.character2], {model: CharacterModel}));
            this.characterViews = [this.character1View, this.character2View];
            this.model.set('characterTurnCharacter', 0),
            this.characterViews[0].setStartPosition(this.grid.getTile(1, 1));
            this.characterViews[1].setStartPosition(this.grid.getTile(3, 2));
            
            // set up additional models
            this.pathfinder = new Pathfinder(this.grid);
            this.stateManager = new StateManagerModel();
            
            // set up additional views
            // TODO: consider renaming to have "Menu" in the name
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
            this.model.set('selectedTile', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile'));
            
            // set up events
            this.listenTo(this.model, 'change:characterTurnPrimaryAction', this.onCharacterTurnPrimaryActionChange);
            this.listenTo(this.model, 'change:characterTurnCharacter', this.onTurnChange);
            this.listenTo(this.model, 'change:focusedTile', this.onFocusedTileChange);
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
        
        events: {
            'click': 'onClick',
            'mouseleave': 'onMouseLeave',
            'mousemove': 'onMouseMove'
        },
        
        onMoveComplete: function () {
            this.model.set('characterTurnMovementRange', this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
            this.model.set('selectedTile', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile'));
        },
        
        onFocusedTileChange: function () {
            if (this.model.get('characterTurnPrimaryAction') === constants.characterTurn.primaryAction.MOVE) {
                var focusedTile = this.model.get('focusedTile');
                if (!focusedTile || !this.pathfinder.isTileInRange(focusedTile)) {
                    this.model.set('characterTurnPath', []);
                }
                else if (focusedTile.isMoveable()) {
                    this.model.set('characterTurnPath', this.pathfinder.nodesInRange[focusedTile.id].path);
                }
            }
        },
        
        onMouseMove: function (event) {
            this.model.set('focusedTile', this.gridView.hitTest(event, this.foreground));
        },
        
        onMouseLeave: function (event) {
            // removes mousemove triggered visuals when mouse is not over canvas
            this.model.set('focusedTile', null);
            this.model.set('characterTurnPath', []);
        },
        
        onTurnChange: function () {
            // TODO: consider refactoring so that all turn changes happen here
        },
        
        onClick: function () {
            switch (this.model.get('characterTurnPrimaryAction')) {
                case constants.characterTurn.primaryAction.ATTACK:
                    if (this.isTileInAttackRange(this.model.get('focusedTile'))) {
                        this.attack();
                    }
                    break;
                case constants.characterTurn.primaryAction.END_TURN:
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    if (this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('movementRange') > 0 && this.pathfinder.isTileInRange(this.model.get('focusedTile'))) {
                        this.moveCharacter();
                    }
                    break;
                case constants.characterTurn.primaryAction.TACTIC:
                    break;
                case constants.characterTurn.primaryAction.WAIT:
                    break;
            }
        },
        
        moveCharacter: function () {
            this.model.set('selectedTile', null);
            this.model.set('characterTurnPath', []);
            this.characterViews[this.model.get('characterTurnCharacter')].moveTo(this.pathfinder.nodesInRange[this.model.get('focusedTile').id], this.onMoveComplete);
        },
        
        attack: function () {
            this.characterViews[this.model.get('characterTurnCharacter')].attack(this.model.get('focusedTile').occupied);
            this.model.set('characterTurnAttackRange', {});
        },
        
        isTileInAttackRange: function (tile) {
            for (var i in this.model.get('characterTurnAttackRange')) {
                if (i === tile.id) {
                    return true;
                }
            };
            return false;
        },
        
        onCharacterTurnPrimaryActionChange: function () {
            this.model.set('characterTurnMovementRange', {});
            this.model.set('characterTurnAttackRange', {});
            
            switch (this.model.get('characterTurnPrimaryAction')) {
                case constants.characterTurn.primaryAction.ATTACK:
                    this.model.set('characterTurnAttackRange', this.pathfinder.findEnemies(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
                    break;
                case constants.characterTurn.primaryAction.END_TURN:
                    console.log('End turn');
                    this.characterViews[this.model.get('characterTurnCharacter')].reset();
                    this.model.resetCharacterTurn();
                    // TODO: makes this a function that is "chooseNextCharacter" or "switchCharacters" or something
                    if (this.model.get('characterTurnCharacter') < this.model.get('characters').length - 1) {
                        this.model.set('characterTurnCharacter', this.model.get('characterTurnCharacter') + 1);
                    }
                    else {
                        this.model.set('characterTurnCharacter', 0);
                    }
                    this.model.set('selectedTile', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile'));
                    this.characterViews[this.model.get('characterTurnCharacter')].switchCharacters(this.model.get('characters').at(this.model.get('characterTurnCharacter')));
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    console.log('Move');
                    this.model.set('characterTurnMovementRange', this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
                    break;
                case constants.characterTurn.primaryAction.TACTIC:
                    console.log('Tactic');
                    this.characterViews[this.model.get('characterTurnCharacter')].tactic();
                    break;
                case constants.characterTurn.primaryAction.WAIT:
                    console.log('Wait');
                    this.characterViews[this.model.get('characterTurnCharacter')].wait();
                    break;
            }
        },

        update: function (deltaFrameTime) {
            for (var i = 0; i < this.characterViews.length; i++) {
                this.characterViews[i].render();
            }
        },
        
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
            }
        },
        
        renderCharacter: function (canvasCtx) {
            for (var i = 0; i < this.characterViews.length; i++) {
                var characterView = this.characterViews[i];
                canvasCtx.drawImage(characterView.el, characterView.model.get('x'), characterView.model.get('y'));
            }
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

        // TODO: refactor the ways these tiles are rendered. They are almost identical, but different constants.
        // Create a single function that takes (tile, tileDisplayObject or possibly an array of 2 objects, canvasCtx)
        // this "display object" can be a constant itself
        // Separate all this into the Tile view
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
            this.renderMovement(this.model.get('characterTurnAttackRange'), this.foregroundCtx);
            this.renderPaths([this.model.get('characterTurnPath')], this.foregroundCtx);
            this.renderFocusedTile(this.model.get('focusedTile'), this.foregroundCtx);
            this.renderCharacter(this.foregroundCtx);
            
            return this;
        },

        buildFrame: function () {
            this.gameUtilities.time.set('previousFrameTime', this.gameUtilities.time.get('currentFrameTime'));
            this.gameUtilities.time.set('currentFrameTime', Date.now());
            this.gameUtilities.time.set('deltaFrameTime', this.gameUtilitiesView.gameTime.calculateDeltaFrameTime());
            this.gameUtilities.time.set('gameTime', this.gameUtilities.time.get('gameTime') + this.gameUtilities.time.get('deltaFrameTime'));
            this.update(this.gameUtilities.time.get('deltaFrameTime'));
            this.render();
            window.requestAnimationFrame(this.buildFrame);
        }
        
	});
    
	return BattleView;
});