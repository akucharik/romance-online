define([
	'backbone',
    'constants'
], function(
    Backbone,
    constants
) {

	var GridView = Backbone.View.extend({
        elCtx: undefined,
        
        initialize: function() {
			this.elCtx = this.el.getContext('2d');
            this.el.width = constants.canvas.WIDTH;
            this.el.height = constants.canvas.HEIGHT;
            this.render();
		},
        
        render: function () {   
            for (var i = 0; i < this.model.get('tileViews').length; i++) {
                var mapTileView = this.model.get('tileViews')[i];
                this.elCtx.drawImage(mapTileView.el, mapTileView.model.get('x'), mapTileView.model.get('y'));
            }
            
            return this;
        },
        
        hitTest: function (mouseObj, canvas) {		
            var backgroundX = mouseObj.pageX - $(canvas).offset().left;
            var backgroundY = mouseObj.pageY - $(canvas).offset().top;
            
            // handle sub-pixel centering of game if it happens
            backgroundX = (backgroundX < 0) ? 0 : backgroundX;
            backgroundX = (backgroundX > constants.canvas.WIDTH) ? constants.canvas.WIDTH : backgroundX;
            
            var x = Math.floor(backgroundX / constants.grid.TILE_SIZE);
            var y = Math.floor(backgroundY / constants.grid.TILE_SIZE);
            
            return this.model.getTile(x, y);

            // TODO: only needed for non-square/rectangle tile shapes
            //drawTile(tile, foregroundCtx)
            //if(foregroundCtx.isPointInPath(backgroundX, backgroundY)) {
            //	return tile;
            //}
            //else {
            //	return null;	
            //}
        }
		
	});
	
	return GridView;
});