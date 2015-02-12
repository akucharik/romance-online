define([
    'backbone',
    'collections/character',
    'constants',
    'eventLog',
    'time',
    'models/character',
    'models/frameRate',
    'models/grid',
    'models/pathfinder',
    'models/stateManager',
    'models/tile',
    'views/character',
    'views/characterActionsMenu',
    'views/frameRate',
    'views/gameTime',
    'views/grid',
    'views/inGameMenu',
    'views/tile',
    'views/focusedTile',
    'views/selectedTile',
    'views/actionTiles',
    'views/pathTiles'
], function (
    Backbone,
    CharacterCollection,
    constants,
    eventLog,
    time,
    CharacterModel,
    FrameRateModel,
    GridModel,
    Pathfinder,
    StateManagerModel,
    TileModel,
    CharacterView,
    CharacterActionsMenuView,
    FrameRateView,
    GameTimeView,
    GridView,
    InGameMenuView,
    TileView,
    FocusedTileView,
    SelectedTileView,
    ActionTilesView,
    PathTilesView,
    EventLogView
) {

	var BattleView = Backbone.View.extend({
        
		initialize: function() {
            // bind function context
            this.onMoveComplete = this.onMoveComplete.bind(this);
            this.buildFrame = this.buildFrame.bind(this);
            
            // set time
            this.time = time;
            
            // set up game time
            this.gameTime = new GameTimeView({
                model: this.time,
                el: '#gameTime'
            });
            
            // set up frame rate
            this.frameRate = new FrameRateModel();
            this.frameRateView = new FrameRateView({
                model: this.frameRate,
                el: '#frameRate'
            });
            
            // set up in game menu
            this.inGameMenuView = new InGameMenuView({
                el: '#inGameMenu'
            });
            
            // set up grid
            this.grid = new GridModel();
            this.gridView = new GridView({
                model: this.grid,
                tagName: 'canvas'
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
                collection: this.model.get('characterTurnMovementTiles'),
                tagName: 'canvas'
            });
            
            this.pathTilesView = new PathTilesView({
                collection: this.model.get('characterTurnPathTiles'),
                tagName: 'canvas'
            });
            
            this.attackTilesView = new ActionTilesView({
                collection: this.model.get('characterTurnAttackTiles'),
                tagName: 'canvas'
            });
            
            // set up character action menu
            this.characterActionsMenuView = new CharacterActionsMenuView({
                model: this.model,
                el: '#characterActionsMenu'
            });
            
            // set initial state
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
            
            // set up background
            this.background = document.querySelector('#background');
            this.$background = $(this.background);
            this.backgroundCtx = this.background.getContext('2d');
            this.background.width = constants.canvas.WIDTH;
            this.background.height = constants.canvas.HEIGHT;
            this.backgroundCtx.drawImage(this.gridView.el, 0, 0);
            
            // set up foreground
            this.foreground = document.querySelector('#foreground');
            this.$foreground = $(this.foreground);
            this.foregroundCtx = this.foreground.getContext('2d');
            this.foreground.width = constants.canvas.WIDTH;
            this.foreground.height = constants.canvas.HEIGHT;
            
            // set up initial properties
            this.model.get('selectedTile').setGridPosition(
                this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'),
                this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY')
            );
            
            // set up events
            this.listenTo(this.model, 'change:characterTurnPrimaryAction', this.onCharacterTurnPrimaryActionChange);
            this.listenTo(this.model, 'change:characterTurnCharacter', this.onTurnChange);
            this.listenTo(this.model.get('characterTurnMovementNodes'), 'reset', this.oncharacterTurnMovementNodesChange);
            this.listenTo(this.model.get('characterTurnPathNodes'), 'reset', this.oncharacterTurnPathNodesChange);
            this.listenTo(this.model.get('characterTurnAttackNodes'), 'reset', this.oncharacterTurnAttackNodesChange);
            this.listenTo(this.model.get('focusedTile'), 'gridPosition', this.onFocusedTileChange);
            
            // start rendering engine
            window.requestAnimationFrame(this.buildFrame);
		},
        
        events: {
            'click': 'onClick',
            'mouseleave': 'onMouseLeave',
            'mousemove': 'onMouseMove'
        },
        
        // TODO: refactor these functions into one getTilesFromNodes
        oncharacterTurnMovementNodesChange: function () {
            var tiles = [];
            
            this.model.get('characterTurnMovementNodes').each(function (node) {
                tiles.push(this.grid.get('tiles')[node.get('id')]);
            }, this);
            
            this.model.get('characterTurnMovementTiles').reset(tiles);
        },
        
        oncharacterTurnPathNodesChange: function () {
            var tiles = [];
            
            this.model.get('characterTurnPathNodes').each(function (node) {
                tiles.push(this.grid.get('tiles')[node.get('id')]);
            }, this);
            
            this.model.get('characterTurnPathTiles').reset(tiles);
        },
        
        oncharacterTurnAttackNodesChange: function () {
            var tiles = [];
            
            this.model.get('characterTurnAttackNodes').each(function (node) {
                tiles.push(this.grid.get('tiles')[node.get('id')]);
            }, this);
            
            this.model.get('characterTurnAttackTiles').reset(tiles);
        },
        
        onMoveComplete: function () {
            this.model.get('characterTurnMovementNodes').reset(this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
            this.model.get('selectedTile').setGridPosition(
                this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'),
                this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY')
            );
        },
        
        isFocusedTileInMovementRange: function (tile) {
            var tiles = this.model.get('characterTurnMovementTiles').models;
            
            for (var i = 0; i < tiles.length; i++) {
                if (tiles[i].isEqual(tile)) {
                    return true;
                }
            }
            
            return false;
        },
        
        onFocusedTileChange: function () {
            //eventLog.collection.add({ message: 'Focused tile changed'});
            if (this.model.get('characterTurnPrimaryAction') === constants.characterTurn.primaryAction.MOVE) {
                var focusedTile = this.model.get('focusedTile');
                if (!focusedTile || !this.isFocusedTileInMovementRange(focusedTile)) {
                    this.model.get('characterTurnPathNodes').reset();
                }
                else if (this.model.get('characterTurnMovementTiles').findWhere({ id: focusedTile.get('id') }).isMoveable()) {
                    this.model.get('characterTurnPathNodes').reset(this.model.get('characterTurnMovementNodes').findWhere({ id: focusedTile.get('id') }).get('path'));
                }
            }
        },
        
        onMouseMove: function (event) {
            var currentTile = this.determineFocusedTile(event);
            if (!currentTile.isEqual(this.model.get('focusedTile'))) {
                this.model.get('focusedTile').setGridPosition(currentTile.get('gridX'), currentTile.get('gridY'));
            }
        },
        
        onMouseLeave: function (event) {
            // removes mousemove triggered visuals when mouse is not over canvas
            this.model.get('focusedTile').setGridPosition(null, null);
            this.model.get('characterTurnPathNodes').reset();
        },
        
        onTurnChange: function () {
            // TODO: consider refactoring so that all turn changes happen here
        },
        
        onClick: function () {
            switch (this.model.get('characterTurnPrimaryAction')) {
                case constants.characterTurn.primaryAction.ATTACK:
                    if (this.isTileInAttackTiles(this.model.get('focusedTile'))) {
                        this.attack();
                    }
                    break;
                case constants.characterTurn.primaryAction.END_TURN:
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    if (this.model.get('characterTurnPathTiles').length > 0) {
                        this.moveCharacter();
                    }
                    break;
                case constants.characterTurn.primaryAction.TACTIC:
                    break;
                case constants.characterTurn.primaryAction.WAIT:
                    break;
            }
        },
        
        determineFocusedTile: function (mouseObj) {		
            var backgroundX = mouseObj.pageX - $(this.foreground).offset().left;
            var backgroundY = mouseObj.pageY - $(this.foreground).offset().top;
            
            // handle sub-pixel centering of game if it happens
            backgroundX = (backgroundX < 0) ? 0 : backgroundX;
            backgroundX = (backgroundX > constants.canvas.WIDTH) ? constants.canvas.WIDTH : backgroundX;
            backgroundY = (backgroundY < 0) ? 0 : backgroundY;
            backgroundY = (backgroundY > constants.canvas.HEIGHT) ? constants.canvas.HEIGHT : backgroundY;
            
            var x = Math.floor(backgroundX / constants.grid.TILE_SIZE);
            var y = Math.floor(backgroundY / constants.grid.TILE_SIZE);
            
            return this.grid.getTile(x, y);
        },
        
        moveCharacter: function () {
            this.model.get('selectedTile').setGridPosition(null, null);
            this.characterViews[this.model.get('characterTurnCharacter')].moveTo(this.model.get('characterTurnPathTiles'), this.onMoveComplete);
            this.model.get('characterTurnPathTiles').reset();
        },
        
        attack: function () {
            //this.characterViews[this.model.get('characterTurnCharacter')].attack(this.model.get('focusedTile').get('occupied'));
            this.characterViews[this.model.get('characterTurnCharacter')].model.set('target', this.grid.get('tiles')[this.model.get('focusedTile').get('id')].get('occupied'));
            this.model.get('characterTurnAttackNodes').reset();
        },
        
        isTileInAttackTiles: function (tile) {
            //for (var i in this.model.get('characterTurnAttackTiles')) {
            //    if (i === tile.get('id')) {
            //        return true;
            //    }
            //};
            for (var i = 0; i < this.model.get('characterTurnAttackTiles').models.length; i++) {
                if (this.model.get('characterTurnAttackTiles').models[i].get('id') === tile.get('id')) {
                    return true;
                }
            }
            return false;
        },
        
        onCharacterTurnPrimaryActionChange: function () {
            this.model.get('characterTurnMovementNodes').reset();
            this.model.get('characterTurnAttackNodes').reset();
            
            switch (this.model.get('characterTurnPrimaryAction')) {
                case constants.characterTurn.primaryAction.ATTACK:
                    eventLog.collection.add({ message: 'State: Attack' });
                    this.model.get('characterTurnAttackNodes').reset(this.pathfinder.findEnemies(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
                    break;
                case constants.characterTurn.primaryAction.END_TURN:
                    eventLog.collection.add({ message: 'End turn'});
                    this.characterViews[this.model.get('characterTurnCharacter')].reset();
                    this.model.resetCharacterTurn();
                    // TODO: makes this a function that is "chooseNextCharacter" or "switchCharacters" or something
                    if (this.model.get('characterTurnCharacter') < this.model.get('characters').length - 1) {
                        this.model.set('characterTurnCharacter', this.model.get('characterTurnCharacter') + 1);
                    }
                    else {
                        this.model.set('characterTurnCharacter', 0);
                    }
                    this.model.get('selectedTile').setGridPosition(
                        this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridX'),
                        this.model.get('characters').at(this.model.get('characterTurnCharacter')).get('currentTile').get('gridY')
                    );
                    this.characterViews[this.model.get('characterTurnCharacter')].switchCharacters(this.model.get('characters').at(this.model.get('characterTurnCharacter')));
                    break;
                case constants.characterTurn.primaryAction.MOVE:
                    eventLog.collection.add({ message: 'State: Move'});
                    this.model.get('characterTurnMovementNodes').reset(this.pathfinder.findPaths(this.model.get('characters').at(this.model.get('characterTurnCharacter'))));
                    break;
                case constants.characterTurn.primaryAction.TACTIC:
                    eventLog.collection.add({ message: 'State: Tactic'});
                    this.characterViews[this.model.get('characterTurnCharacter')].tactic();
                    break;
                case constants.characterTurn.primaryAction.WAIT:
                    eventLog.collection.add({ message: 'State: Waiting'});
                    this.characterViews[this.model.get('characterTurnCharacter')].wait();
                    break;
            }
        },

        update: function () {
            
        },

        renderForeground: function (ctx) {
            // clear canvas
            ctx.clearRect(0, 0, constants.canvas.WIDTH, constants.canvas.HEIGHT);
            
            // character path tiles
            ctx.drawImage(this.pathTilesView.el, 0, 0);
            
            // character movement tiles
            ctx.drawImage(this.movementTilesView.el, 0, 0);
            
            // character attack tiles
            ctx.drawImage(this.attackTilesView.el, 0, 0);
            
            // selected tile
            ctx.drawImage(this.selectedTileView.el, this.model.get('selectedTile').get('x'), this.model.get('selectedTile').get('y'));
            
            // focused tile
            ctx.drawImage(this.focusedTileView.el, this.model.get('focusedTile').get('x'), this.model.get('focusedTile').get('y'));
            
            // characters
            var characterView = null;
            for (var i = 0; i < this.characterViews.length; i++) {
                characterView = this.characterViews[i];
                ctx.drawImage(characterView.render().el, characterView.model.get('x'), characterView.model.get('y'));
            }
            
            return this;
        },

        buildFrame: function () {
            if (!this.time.get('isPaused')) {
                this.time.set('frameTime', Date.now() / 1000);
                this.update();
                this.renderForeground(this.foregroundCtx);
            }
            window.requestAnimationFrame(this.buildFrame);
        }
        
	});
    
	return BattleView;
});