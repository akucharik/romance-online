define([
	'jquery',
    'modules/engine',
    'modules/battle-m',
    'modules/battle-v',
    'modules/character-m',
	'modules/characterBattle-v',
    'modules/utilities-m',
    'modules/utilities-v'
    
], function($, Engine, BattleModel, BattleView, CharacterModel, CharacterBattleView, UtilitiesModel, UtilitiesView) {
    
    //'use strict';
    
    if (typeof(Battle) === 'undefined') {
        window.Battle = {};
    }
    // TODO: Eventually remove this. Used to expose models for testing/development.
    Battle.Characters = CharacterModel;
    Battle.Utilities = UtilitiesModel;
    Battle.Battle = BattleModel;
    
    Engine.init();
});