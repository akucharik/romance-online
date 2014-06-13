define([
	'backbone',
    'modules/constants'
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
            for (var i in this.model.get('tiles')) {
                this.drawTile(this.model.get('tiles')[i]);
                this.elCtx.fillStyle = this.getFillStyle(this.model.get('tiles')[i].type);
                this.elCtx.fill();
                
                this.elCtx.fillStyle = 'rgba(0, 0, 0, 1.0)';
                this.elCtx.font = "10px Arial";
                this.elCtx.fillText(i, this.model.get('tiles')[i].x + 6 , this.model.get('tiles')[i].y + 15);
            }
            
            return this;
        },
        
        drawTile: function (tile) {
            if (tile !== undefined && tile !== null) {
                this.elCtx.beginPath();
                this.elCtx.rect(tile.x, tile.y, constants.grid.TILE_SIZE, constants.grid.TILE_SIZE);
            }
        },
        
        getFillStyle: function (type) {
            switch (type) {
                case constants.tile.type.OBSTACLE:
                    return 'rgba(100, 100, 100, 1.0)';
                case constants.tile.type.TREE:
                    return 'rgba(50, 150, 50, 1.0)';
                default:
                    return 'rgba(100, 200, 100, 1.0)';
            }
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