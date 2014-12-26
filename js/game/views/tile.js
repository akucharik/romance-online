define([
	'backbone',
    'jquery',
    'constants'
], function(
    Backbone,
    $,
    constants
) {

	var TileView = Backbone.View.extend({
		
		initialize: function () {
            if (this.tagName !== 'canvas') {
                this.tagName = 'canvas';
                this.setElement(document.createElement('canvas'));
            }
            
            this.elCtx = this.el.getContext('2d');
		},
        
        render: function () {
            this.el.width = constants.grid.TILE_SIZE;
            this.el.height = constants.grid.TILE_SIZE;
            
            if ($.isNumeric(this.model.gridX) && $.isNumeric(this.model.gridY)) {
                switch (this.model.renderType) {
                    case constants.tile.renderType.FOCUSED:
                        this.drawFocusedTile();
                        break;
                    case constants.tile.renderType.MAP:
                        this.drawMapTile();
                        break;
                    case constants.tile.renderType.SELECTED:
                        this.drawSelectedTile();
                        break;
                }
            }
            // clear tile display if tile does not have grid coordinates
            else {
                this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            }
            
            return this;
        },
        
        drawTile: function (indentValue) {
            var indent = (typeof indentValue === 'undefined' ? 0 : indentValue);
            this.elCtx.beginPath();
            this.elCtx.rect(indent/2, indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
        },
        
        drawFocusedTile: function () {
            this.elCtx.strokeStyle = constants.grid.FOCUSED_BORDER_FILL_STYLE;
            this.elCtx.lineWidth = constants.grid.FOCUSED_BORDER_WIDTH;
            this.drawTile(constants.grid.FOCUSED_INDENT);
            this.elCtx.stroke();

            this.elCtx.strokeStyle = constants.grid.FOCUSED_OUTER_BORDER_FILL_STYLE;
            this.elCtx.lineWidth = constants.grid.FOCUSED_OUTER_BORDER_WIDTH;
            this.drawTile(constants.grid.FOCUSED_OUTER_BORDER_INDENT);
            this.elCtx.stroke();
        },
        
        drawMapTile: function () {
        
        },
        
        drawSelectedTile: function () {
            this.elCtx.fillStyle = constants.grid.SELECTED_FILL_STYLE;
            this.elCtx.strokeStyle = constants.grid.SELECTED_BORDER_FILL_STYLE;
            this.elCtx.lineWidth = constants.grid.SELECTED_BORDER_WIDTH;
            this.drawTile(constants.grid.SELECTED_INDENT);
            this.elCtx.fill();
            this.elCtx.stroke();
        }
        
	});
	
	return TileView;
});