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

	var SelectedTileView = TileView.extend({
        
        render: function () {
            if ($.isNumeric(this.model.get('x')) && $.isNumeric(this.model.get('y'))) {
                this.elCtx.fillStyle = constants.grid.SELECTED_FILL_STYLE;
                this.elCtx.strokeStyle = constants.grid.SELECTED_BORDER_FILL_STYLE;
                this.elCtx.lineWidth = constants.grid.SELECTED_BORDER_WIDTH;
                this.drawTile(constants.grid.SELECTED_INDENT);
                this.elCtx.fill();
                this.elCtx.stroke();
            }
            else {
                this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            }
            
            return this;
        }
        
	});
	
	return SelectedTileView;
});