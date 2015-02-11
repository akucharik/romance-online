define([
    'models/time',
    'views/time'
], function(
    TimeModel,
    TimeView
) {
    
    //'use strict';
    
    var time = new TimeModel();
    
    var timeView = new TimeView({ 
        model: time
    });
    
    return time;
});