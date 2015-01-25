define([
	'backbone',
    'jquery',
    'constants',
    'views/pathTile'
], function(
    Backbone,
    $,
    constants,
    PathTileView
) {

	var PathTilesView = Backbone.View.extend({
		
		initialize: function () {
            if (this.tagName !== 'canvas') {
                this.tagName = 'canvas';
                this.setElement(document.createElement('canvas'));
            }
            
            this.elCtx = this.el.getContext('2d');
            
            this.el.width = constants.canvas.WIDTH;
            this.el.height = constants.canvas.HEIGHT;
            
            this.pathTileView = new PathTileView({
                tagName: 'canvas'
            });
            
            this.listenTo(this.collection, 'reset', this.render);
		},
        
        render: function () {
            this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            
            if (this.collection.length > 0) {
                this.collection.each(function (pathTile) {
                    this.elCtx.drawImage(this.pathTileView.el, pathTile.get('x'), pathTile.get('y'));
                }, this);
            }
            
            return this;
        }
        
	});
	
	return PathTilesView;
});