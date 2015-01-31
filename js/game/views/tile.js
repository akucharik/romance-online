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
            
            this.listenTo(this.model, 'gridPosition', this.onGridPositionChange);
            
            this.el.width = constants.grid.TILE_SIZE;
            this.el.height = constants.grid.TILE_SIZE;
            
            this.render();
		},
        
        render: function () {
            // rendering is defined in subclasses
            return this;
        },
        
        drawTile: function (indentValue) {
            var indent = (typeof indentValue === 'undefined' ? 0 : indentValue);
            this.elCtx.beginPath();
            this.elCtx.rect(indent/2, indent/2, constants.grid.TILE_SIZE - indent, constants.grid.TILE_SIZE - indent);
        },
        
        onGridPositionChange: function () {
            this.model.setPosition();
            this.model.setId();
            this.render();
        }
        
	});
	
	return TileView;
});