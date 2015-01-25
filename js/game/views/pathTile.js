define([
	'backbone',
    'jquery',
    'constants'
], function(
    Backbone,
    $,
    constants
) {

	var PathTileView = Backbone.View.extend({
        
        initialize: function () {
            if (this.tagName !== 'canvas') {
                this.tagName = 'canvas';
                this.setElement(document.createElement('canvas'));
            }
            
            this.elCtx = this.el.getContext('2d');
            
            this.el.width = constants.grid.TILE_SIZE;
            this.el.height = constants.grid.TILE_SIZE;
            
            this.render();
		},
        
        render: function () {
            this.elCtx.fillStyle = constants.grid.SELECTED_FILL_STYLE;
            this.elCtx.strokeStyle = constants.grid.SELECTED_BORDER_FILL_STYLE;
            this.elCtx.lineWidth = constants.grid.SELECTED_BORDER_WIDTH;
            this.drawTile(constants.grid.SELECTED_INDENT);
            this.elCtx.fill();
            this.elCtx.stroke();
            
            return this;
        },
        
        drawTile: function (indentValue) {
            var indent = (typeof indentValue === 'undefined' ? 0 : indentValue);
            this.elCtx.beginPath();
            this.elCtx.rect(indent/2, indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
        }
	});
	
	return PathTileView;
});