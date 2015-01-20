define([
    'backbone',
    'jquery'
], function(
    Backbone,
    $
) {

    var Node = Backbone.Model.extend({
		defaults: {
            cost: 1,
            gridX: null,
            gridY: null,
            id: null,
            path: [],
            pathCost: 0
		},

        initialize: function (options) {
            options = options || {};

            this.setGridPosition(options.gridX, options.gridY);
            this.setId();
            this.set('cost', options.cost ? options.cost : 1);
            this.set('path', options.path ? options.path : []);
            this.set('pathCost', options.pathCost ? options.pathCost : 0);
        },
        
        buildKey: function (x, y) {
            return x + '_' + y;
        },
        
        isEqual: function (tile) {
            if (this.get('gridX') === tile.get('gridX') && this.get('gridY') === tile.get('gridY')) {
                return true;
            } else {
                return false;
            }
        },
        
        setId: function () {
            if ($.isNumeric(this.get('gridX')) && $.isNumeric(this.get('gridY'))) {
                this.set('id', this.buildKey(this.get('gridX'), this.get('gridY')));
            }
            else {
                this.set('id', null);
            }
        },
        
        setGridPosition: function (x, y) {
            this.set('gridX', $.isNumeric(x) ? x : null);
            this.set('gridY', $.isNumeric(y) ? y : null);
        }
        
    });
    
	return Node;
});