define([
	'jquery',
    'modules/battle-m',
    'modules/battle-v',
    'modules/character-m',
    'modules/grid-m',
    'modules/pathfinder'
], function($, battle, battleView, characters, grid, pathfinder) {
    
    //'use strict';
    
    if (typeof(Battle) === 'undefined') {
        window.Battle = {};
    }
    // TODO: Eventually remove this. Used to expose models for testing/development.
    Battle.characters = characters;
    Battle.battle = battle;
    Battle.grid = grid;
    Battle.pathfinder = pathfinder;
    
    // TODO: battleView currently needs to be exposed until rendering is refactored
    Battle.battleView = battleView;
    
});