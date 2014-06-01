define([
	'jquery',
    'modules/battle-v',
], function(
    $, 
    BattleView
) {
    
    //'use strict';
    
    if (typeof(Battle) === 'undefined') {
        window.Battle = {};
    }
    
    Battle.battleView = new BattleView({
        el: '#foreground'
    });
    
});