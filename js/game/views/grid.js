define([
	'backbone',
    'constants'
], function(
    Backbone,
    constants
) {

	var GridView = Backbone.View.extend({
        
        initialize: function() {
            if (this.tagName !== 'canvas') {
                this.tagName = 'canvas';
                this.setElement(document.createElement('canvas'));
            }
            
            this.elCtx = this.el.getContext('2d');
            
            this.el.width = constants.canvas.WIDTH;
            this.el.height = constants.canvas.HEIGHT;
            
            this.render();
		},
        
        render: function () {
            var mapTileView = null;
            for (var i = 0; i < this.model.get('tileViews').length; i++) {
                mapTileView = this.model.get('tileViews')[i];
                this.elCtx.drawImage(mapTileView.el, mapTileView.model.get('x'), mapTileView.model.get('y'));
            }
            
            return this;
        }
		
	});
	
	return GridView;
});