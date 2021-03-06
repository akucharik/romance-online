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
            
            this.actionTileView = new ActionTileView({
                tagName: 'canvas'
            });
            
            this.listenTo(this.collection, 'reset', this.render);
		},
        
        render: function () {
            this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            
            if (this.collection.length > 0) {
                console.log('draw action tiles');
                this.collection.each(function (actionTile) {
                    this.elCtx.drawImage(this.actionTileView.el, actionTile.get('x'), actionTile.get('y'));
                }, this);
            }
            
            return this;
        }
        
	});
	
	return ActionTilesView;
});