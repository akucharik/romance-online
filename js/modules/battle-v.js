define([
	'jquery',
	'backbone',
	'modules/battle-m'
], function($, Backbone, battleModel) {

	var BattleView = Backbone.View.extend({
		el: '#foreground',
		
		initialize: function() {
            var canvas = battleModel.get('canvas');
            
            // init background
            canvas.set('background', document.getElementById('background'));
            canvas.set('$background', $(canvas.get('background')));
            canvas.set('backgroundCtx', canvas.get('background').getContext('2d'));
            canvas.get('background').width = canvas.get('width');
            canvas.get('background').height = canvas.get('height');
            battleModel.createGrid();

            // init foreground
            canvas.set('foreground', document.getElementById('foreground'));
            canvas.set('$foreground', $(canvas.get('foreground')));
            canvas.set('foregroundCtx', canvas.get('foreground').getContext('2d'));
            canvas.get('foreground').width = canvas.get('width');
            canvas.get('foreground').height = canvas.get('height');
            
            this.listenTo(battleModel.get('grid'), 'change:focusedTile', this.focusedTileChanged);
		},
        
		render: function() {
            //console.log('render battle view');
		},
		
		events: {
			'mousemove': 'onMouseMove'
		},
        
        onMouseMove: function (event) {
            battleModel.get('mouse').pageX = event.pageX;
            battleModel.get('mouse').pageY = event.pageY;          
            battleModel.get('grid').set('focusedTile', battleModel.hitTest(event));
        },
        
        focusedTileChanged: function () {
            console.log('focused tile changed');
        }
	});
    
	return new BattleView();
});