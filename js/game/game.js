define([
	'jquery',
    'models/battle-m',
    'views/battle-v',
], function(
    $, 
    BattleModel,
    BattleView
) {
    
    //'use strict';
    
    if (typeof(Battle) === 'undefined') {
        window.Battle = {};
    }
    
    var battle = new BattleModel();
        
    Battle.battleView = new BattleView({
        model: battle,
        el: '#foreground'
    });
    
});