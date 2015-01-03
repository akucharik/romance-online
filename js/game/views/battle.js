define([
    'backbone',
    'collections/character',
    'constants',
    'models/character',
    'models/gameUtilities',
    'models/grid',
    'models/pathfinder',
    'models/stateManager',
    'models/tile',
    'views/character',
    'views/characterTurn',
    'views/gameUtilities',
    'views/grid',
    'views/tile',
    'views/focusedTile',
    'views/selectedTile',
    'views/actionTiles'
], function (
    Backbone,
    CharacterCollection,
    constants, 
    CharacterModel,
    GameUtilitiesModel, 
    GridModel, 
    Pathfinder,
    StateManagerModel,
    TileModel,
    CharacterView,
    CharacterTurnView,
    GameUtilitiesView,
    GridView,
    TileView,
    FocusedTileView,
    SelectedTileView,
    ActionTilesView
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
            
            this.focusedTileView = new FocusedTileView({
                model: this.model.get('focusedTile'),
                tagName: 'canvas'
            });
            
            this.selectedTileView = new SelectedTileView({
                model: this.model.get('selectedTile'),
                tagName: 'canvas'
            });
            
            this.movementTilesView = new ActionTilesView({
                collection: this.model.get('characterTurnMovementRange'),
                tagName: 'canvas'
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
            // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
            // TODO: either handle it differently or consolidate code.
            // TODO: perhaps have a function that sets both x and y at the same time.
            this.model.get('selectedTile').set('gridX', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'));
            this.model.get('selectedTile').set('gridY', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY'));
            
            // set up events
            this.listenTo(this.model, 'change:characterTurnPrimaryAction', this.onCharacterTurnPrimaryActionChange);
            this.listenTo(this.model, 'change:characterTurnCharacter', this.onTurnChange);
            this.listenTo(this.model.get('characterTurnMovementRange'), 'reset', this.onCharacterTurnMovementRangeChange);
            this.listenTo(this.model, 'change:focusedTile', this.onFocusedTileChange);
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
        
        events: {
            'click': 'onClick',
            'mouseleave': 'onMouseLeave',
            'mousemove': 'onMouseMove'
        },
        
        onCharacterTurnMovementRangeChange: function () {
            console.log("Movement Range: ", this.model.get('characterTurnMovementRange'));
        },
        
        onMoveComplete: function () {
            var pathsObj = this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter')));
            var paths = [];
            for (var tile in pathsObj) {
                paths.push(pathsObj[tile]);
            }
            this.model.get('characterTurnMovementRange').reset(paths);
            // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
            // TODO: either handle it differently or consolidate code.
            // TODO: perhaps have a function that sets both x and y at the same time.
            this.model.get('selectedTile').set('gridX', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'));
            this.model.get('selectedTile').set('gridY', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY'));
        },
        
        onFocusedTileChange: function () {
            if (this.model.get('characterTurnPrimaryAction') === constants.characterTurn.primaryAction.MOVE) {
                var focusedTile = this.model.get('focusedTile');
                if (!focusedTile || !this.pathfinder.isTileInRange(focusedTile)) {
                    this.model.set('characterTurnPath', []);
                }
                else if (focusedTile.isMoveable()) {
                    this.model.set('characterTurnPath', this.pathfinder.nodesInRange[focusedTile.get('id')].path);
                }
            }
        },
        
        onMouseMove: function (event) {
            var currentTile = this.gridView.hitTest(event, this.foreground);
            // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
            // TODO: either handle it differently or consolidate code.
            // TODO: perhaps have a function that sets both x and y at the same time.
            this.model.get('focusedTile').set('gridX', currentTile.get('gridX'));
            this.model.get('focusedTile').set('gridY', currentTile.get('gridY'));
        },
        
        onMouseLeave: function (event) {
            // removes mousemove triggered visuals when mouse is not over canvas
            // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
            // TODO: either handle it differently or consolidate code.
            // TODO: perhaps have a function that sets both x and y at the same time.
            this.model.get('focusedTile').set('gridX', null);
            this.model.get('focusedTile').set('gridY', null);
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
            // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
            // TODO: either handle it differently or consolidate code.
            this.model.get('selectedTile').set('gridX', null);
            this.model.get('selectedTile').set('gridY', null);
            this.model.set('characterTurnPath', []);
            this.characterViews[this.model.get('characterTurnCharacter')].moveTo(this.pathfinder.nodesInRange[this.model.get('focusedTile')], this.onMoveComplete);
        },
        
        attack: function () {
            this.characterViews[this.model.get('characterTurnCharacter')].attack(this.model.get('focusedTile').get('occupied'));
            this.model.set('characterTurnAttackRange', {});
        },
        
        isTileInAttackRange: function (tile) {
            for (var i in this.model.get('characterTurnAttackRange')) {
                if (i === tile.get('id')) {
                    return true;
                }
            };
            return false;
        },
        
        onCharacterTurnPrimaryActionChange: function () {
            this.model.get('characterTurnMovementRange').reset();
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
                    // TODO: setting gridX and gridY of selected tile is almost exactly like focused tile.
                    // TODO: either handle it differently or consolidate code.
                    this.model.get('selectedTile').set('gridX', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'));
                    this.model.get('selectedTile').set('gridY', this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY'));
                    this.characterViews[this.model.get('characterTurnCharacter')].switchCharacters(this.model.get('characters').at(this.model.get('characterTurnCharacter')));
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    console.log('Move');
                    // TODO: had to convert object of tile to array of tile to populate collection.
                    // TODO: it should be returned as an array from the pathfinder instead
                    var pathsObj = this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter')));
                    var paths = [];
                    for (var tile in pathsObj) {
                        paths.push(pathsObj[tile]);
                    }
                    this.model.get('characterTurnMovementRange').reset(paths);
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
            
        },
        
        // TODO: Refactor path rendering to use tile rendering via Backbone
        drawTile: function (tile, canvasCtx, indentValue) {
            if (tile !== undefined && tile !== null) {
                var indent = (indentValue === undefined ? 0 : indentValue);
                canvasCtx.beginPath();
                canvasCtx.rect(tile.x + indent/2, tile.y + indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
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

        render: function () {
            this.foregroundCtx.clearRect(0, 0, constants.canvas.WIDTH, constants.canvas.HEIGHT);
            //this.renderPaths([this.model.get('characterTurnPath')], this.foregroundCtx);
            
            // render character movement tiles
            this.foregroundCtx.drawImage(this.movementTilesView.el, 0, 0);
            
            // render selected tile
            this.foregroundCtx.drawImage(this.selectedTileView.render().el, this.model.get('selectedTile').get('x'), this.model.get('selectedTile').get('y'));
            
            // render focused tile
            this.foregroundCtx.drawImage(this.focusedTileView.render().el, this.model.get('focusedTile').get('x'), this.model.get('focusedTile').get('y'));
            
            // render characters
            var characterView = null;
            
            for (var i = 0; i < this.characterViews.length; i++) {
                characterView = this.characterViews[i];
                this.foregroundCtx.drawImage(characterView.render().el, characterView.model.get('x'), characterView.model.get('y'));
            }
            
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