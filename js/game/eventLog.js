define([
	'backbone',
    'models/logItem',
    'views/eventLog'
], function(
    Backbone,
    LogItemModel,
    EventLogView
) {
    
    //'use strict';
    
    var eventLog = new Backbone.Collection([], { 
        model: LogItemModel
    });
    
    var eventLogView = new EventLogView({
        collection: eventLog,
        el: '#eventLog'
    });
    
    return eventLogView;
});