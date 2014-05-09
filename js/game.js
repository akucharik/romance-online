define([
	'jquery',
    'modules/battle-m',
    'modules/battle-v',
    'modules/character-m',
    'modules/grid-m'
], function($, battle, battleView, characters, grid) {
    
    //'use strict';
    
    if (typeof(battle) === 'undefined') {
        window.battle = {};
    }
    // TODO: Eventually remove this. Used to expose models for testing/development.
    battle.characters = characters;
    battle.battle = battle;
    battle.grid = grid;
    
    // TODO: battleView currently needs to be exposed until rendering is refactored
    battle.battleView = battleView;
    
});