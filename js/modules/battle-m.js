define([
	'backbone'
], function(Backbone) {
    
	var Battle = Backbone.Model.extend({
		defaults: {
            background: null,
            backgroundCtx: null,
            foreground: null,
            foregroundCtx: null
		}
        
	});
	
	return new Battle();
});