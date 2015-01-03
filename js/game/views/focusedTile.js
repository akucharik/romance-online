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

	var FocusedTileView = TileView.extend({
        
        render: function () {
            if ($.isNumeric(this.model.get('x')) && $.isNumeric(this.model.get('y'))) {
                this.elCtx.strokeStyle = constants.grid.FOCUSED_BORDER_FILL_STYLE;
                this.elCtx.lineWidth = constants.grid.FOCUSED_BORDER_WIDTH;
                this.drawTile(constants.grid.FOCUSED_INDENT);
                this.elCtx.stroke();

                this.elCtx.strokeStyle = constants.grid.FOCUSED_OUTER_BORDER_FILL_STYLE;
                this.elCtx.lineWidth = constants.grid.FOCUSED_OUTER_BORDER_WIDTH;
                this.drawTile(constants.grid.FOCUSED_OUTER_BORDER_INDENT);
                this.elCtx.stroke();
            }
            else {
                this.elCtx.clearRect(0, 0, this.el.width, this.el.height);
            }
            
            return this;
        }
        
	});
	
	return FocusedTileView;
});