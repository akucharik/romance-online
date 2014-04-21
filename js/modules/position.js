define([
    'class'
], function(Class) {

    var Position = Class.extend({
        init: function (x, y) {
            this.x = x;
            this.y = y;
        }
    });
    
	return Position;
});