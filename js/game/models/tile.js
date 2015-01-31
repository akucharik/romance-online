define([
    'backbone',
    'jquery',
    'constants'
], function(
    Backbone,
    $,
    constants
) {

    var Tile = Backbone.Model.extend({
		defaults: {
            cost: 0,
            gridX: null,
            gridY: null,
            id: null,
            occupied: null,
            type: null,
            x: null,
            y: null,
		},

        initialize: function (options) {
            options = options || {};

            this.set('gridX', $.isNumeric(options.gridX) ? options.gridX : null);
            this.set('gridY', $.isNumeric(options.gridY) ? options.gridY : null);
            this.setPosition();
            this.setId();
            this.set('occupied', options.occupied || null);
            this.set('type', options.type || null);
            
            this.setCost();
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
        
        isMoveable: function () {
            if (this.get('occupied') === null && this.get('type') !== constants.tile.type.OBSTACLE) {
                return true;
            }
            else {
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
            this.set('gridX', x);
            this.set('gridY', y);
            this.trigger('gridPosition');
        },
        
        setPosition: function () {
            if ($.isNumeric(this.get('gridX')) && $.isNumeric(this.get('gridY'))) {
                this.set('x', this.get('gridX') * constants.grid.TILE_SIZE);
                this.set('y', this.get('gridY') * constants.grid.TILE_SIZE);
            }
            else {
                this.set('x', null);
                this.set('y', null);
            }
        },
        
        setCost: function () {
            switch (this.get('type')) {
                case constants.tile.type.OBSTACLE:
                    this.set('cost', constants.tile.cost.OBSTACLE);
                    break;
                case constants.tile.type.TREE:
                    this.set('cost', constants.tile.cost.TREE);
                    break;
                default:
                    this.set('cost', constants.tile.cost.BASE);
            }
        }
        
    });
    
	return Tile;
});