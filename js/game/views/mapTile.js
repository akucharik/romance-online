define([
	'backbone',
    'jquery',
    'constants',
    'views/tile'
], function(
    Backbone,
    $,
    constants,
    TileView
) {

	var MapTileView = TileView.extend({
        
        render: function () {
            this.drawTile();
            switch (this.model.get('type')) {
                case constants.tile.type.BASE:
                    this.elCtx.fillStyle = constants.tile.fillStyle.BASE;
                    break;
                case constants.tile.type.OBSTACLE:
                    this.elCtx.fillStyle = constants.tile.fillStyle.OBSTACLE;
                    break;
                case constants.tile.type.TREE:
                    this.elCtx.fillStyle = constants.tile.fillStyle.TREE;
                    break;
            }
            this.elCtx.fill();
            this.elCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
            this.elCtx.font = "10px Arial";
            this.elCtx.fillText(this.model.get('id'), 6 , 15);
            
            return this;
        }
        
	});
	
	return MapTileView;
});