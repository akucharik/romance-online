define([
	'backbone',
    'jquery',
    'constants',
    'views/actionTile'
], function(
    Backbone,
    $,
    constants,
    ActionTileView
) {

	var ActionTilesView = Backbone.View.extend({
		
		initialize: function () {
            if (this.tagName !== 'canvas') {
                this.tagName = 'canvas';
                this.setElement(document.createElement('canvas'));
            }
            
            this.elCtx = this.el.getContext('2d');
            
            this.el.width = constants.canvas.WIDTH;
            this.el.height = constants.canvas.HEIGHT;
            
            this.listenTo(this.collection, 'reset', this.render);
		},
        
        render: function () {
            if (this.collection.length > 0) {
                //console.log('draw action tiles');
                this.collection.each(function (tile) {
                    var actionTileView = new ActionTileView({
                        model: tile,
                        tagName: 'canvas'
                    });

                    this.elCtx.drawImage(actionTileView.el, actionTileView.model.get('x'), actionTileView.model.get('y'));
                }, this);
            }
            else {
                this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            }
            
            return this;
        }
        
	});
	
	return ActionTilesView;
});